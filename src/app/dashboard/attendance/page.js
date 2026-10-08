"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { listenData, saveAttendance } from "@/lib/db";

import {
  Calendar,
  Search,
  Filter,
  Check,
  Clock,
  X,
  RotateCcw,
  IndianRupee,
  Building2,
} from "lucide-react";

import Image from "next/image";
import { motion } from "framer-motion";

// ================= ANIMATION =================
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function AttendancePage() {
  const { user, isSimulation } = useAuth();

  // ================= STATES =================
  const [workers, setWorkers] = useState({});
  const [sites, setSites] = useState({});
  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState("all");

  const [selectedSites, setSelectedSites] = useState({});

  // ================= DATE =================
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!user) return;

    const unsubWorkers = listenData(
      user.uid,
      "workers",
      (data) => {
        setWorkers(data || {});
      }
    );

    const unsubSites = listenData(
      user.uid,
      "sites",
      (data) => {
        setSites(data || {});
        setLoading(false);
      }
    );

    return () => {
      unsubWorkers();
      unsubSites();
    };
  }, [user]);

  // ================= LOAD ATTENDANCE =================
  useEffect(() => {
    if (!user || !selectedDate) return;

    const unsubAttendance = listenData(
      user.uid,
      `attendance/${selectedDate}`,
      (data) => {
        setAttendance(data || {});
      }
    );

    return () => unsubAttendance();
  }, [user, selectedDate]);

  // ================= SAVE =================
  const handleAttendance = async (
    workerId,
    status,
    siteId
  ) => {
    try {
      await saveAttendance(
        user.uid,
        selectedDate,
        workerId,
        status,
        siteId
      );
    } catch (err) {
      console.error(err);
      alert("Attendance save failed");
    }
  };

  // ================= WORKER LIST =================
  const workerList = Object.keys(workers)
    .map((id) => ({
      id,
      ...workers[id],
      siteName:
        sites?.[workers[id]?.siteId]?.siteName ||
        "No Site",
    }))
    .filter((worker) => {
      const matchesSearch =
        worker?.name
          ?.toLowerCase()
          ?.includes(searchTerm.toLowerCase()) ||
        worker?.phone?.includes(searchTerm);

      const matchesSite =
        siteFilter === "all" ||
        worker.siteId === siteFilter;

      return matchesSearch && matchesSite;
    });
    

  // ================= STATS =================
  const stats = {
    present: 0,
    halfDay: 0,
    absent: 0,
    unmarked: 0,
  };

  workerList.forEach((worker) => {
    const status =
      attendance?.[worker.id]?.status;

    if (status === "Present") stats.present++;
    else if (status === "Half Day")
      stats.halfDay++;
    else if (status === "Absent")
      stats.absent++;
    else stats.unmarked++;
  });

  // ================= UI =================
  return (
    <div className="space-y-6 pb-72">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-amber-500" />
            Attendance
          </h1>

          <p className="text-xs text-stone-400 mt-1">
            Daily attendance with site selection
          </p>
        </div>

        {/* DATE */}
        <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 rounded-xl px-4 py-2">

          <Calendar className="h-4 w-4 text-amber-500" />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="bg-transparent text-white outline-none text-sm"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <div className="bg-stone-900 border border-emerald-500/20 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase text-emerald-400">
            Present
          </p>

          <h2 className="text-3xl font-black text-white mt-2">
            {stats.present}
          </h2>
        </div>

        <div className="bg-stone-900 border border-amber-500/20 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase text-amber-400">
            Half Day
          </p>

          <h2 className="text-3xl font-black text-white mt-2">
            {stats.halfDay}
          </h2>
        </div>

        <div className="bg-stone-900 border border-red-500/20 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase text-red-400">
            Absent
          </p>

          <h2 className="text-3xl font-black text-white mt-2">
            {stats.absent}
          </h2>
        </div>

        <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4">
          <p className="text-xs font-bold uppercase text-stone-400">
            Unmarked
          </p>

          <h2 className="text-3xl font-black text-white mt-2">
            {stats.unmarked}
          </h2>
        </div>
      </div>

      {/* FILTER */}
      <div className="bg-stone-900 border border-stone-700 rounded-2xl p-4 flex flex-col md:flex-row gap-4">

        {/* SEARCH */}
        <div className="relative flex-1">

          <Search className="absolute left-3 top-3 h-4 w-4 text-stone-500" />

          <input
            type="text"
            placeholder="Search workers..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full bg-black border border-stone-700 rounded-xl pl-10 pr-4 py-2 text-white outline-none"
          />
        </div>

        {/* SITE FILTER */}
        <div className="flex items-center gap-2">

          <Filter className="h-4 w-4 text-amber-500" />

          <select
            value={siteFilter}
            onChange={(e) =>
              setSiteFilter(e.target.value)
            }
            className="bg-black border border-stone-700 rounded-xl px-3 py-2 text-white"
          >
            <option value="all">
              All Sites
            </option>

            {Object.keys(sites).map((id) => (
              <option key={id} value={id}>
                {sites[id]?.siteName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* WORKERS */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >

          {workerList.map((worker) => {

            const currentStatus =
              attendance?.[worker.id]?.status ||
              "Reset";

            return (
              <motion.div
                key={worker.id}
                variants={itemVariants}
                className="bg-stone-900 border border-stone-700 rounded-2xl p-4"
              >

                {/* TOP */}
                <div className="flex gap-3">

                  <div className="relative h-14 w-14 rounded-xl overflow-hidden">

                    <Image
                      src={
                        worker.photoUrl ||
                        `https://api.dicebear.com/7.x/adventurer/svg?seed=${worker.name}`
                      }
                      alt={worker.name}
                      fill
                      className="object-cover"
                      unoptimized={isSimulation}
                    />
                  </div>

                  <div className="flex-1">

                    <h2 className="text-white font-bold text-lg">
                      {worker.name}
                    </h2>

                    <div className="flex items-center gap-1 text-stone-400 text-xs mt-1">
                      <Building2 className="h-3 w-3" />
                      {worker.siteName}
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold mt-2">
                      <IndianRupee className="h-4 w-4" />
                      {Number(
                        worker.dailyWage || 0
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* SITE SELECT */}
                <div className="mt-4">

                  <label className="text-xs text-stone-400">
                    Select Site
                  </label>

                  <select
                    value={
                      selectedSites[worker.id] ||
                      worker.siteId ||
                      ""
                    }
                    onChange={(e) =>
                      setSelectedSites((prev) => ({
                        ...prev,
                        [worker.id]:
                          e.target.value,
                      }))
                    }
                    className="mt-1 w-full bg-black border border-stone-700 rounded-xl px-3 py-2 text-white text-sm"
                  >
                    {Object.keys(sites).map((id) => (
                      <option key={id} value={id}>
                        {sites[id]?.siteName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* BUTTONS */}
                <div className="grid grid-cols-4 gap-2 mt-4">

                  {/* PRESENT */}
                  <button
                    onClick={() =>
                      handleAttendance(
                        worker.id,
                        "Present",
                        selectedSites[
                          worker.id
                        ] || worker.siteId
                      )
                    }
                    className={`rounded-xl py-2 border text-xs font-bold ${
                      currentStatus === "Present"
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                        : "border-stone-700 text-stone-400"
                    }`}
                  >
                    <Check className="h-4 w-4 mx-auto mb-1" />
                    Present
                  </button>

                  {/* HALF */}
                  <button
                    onClick={() =>
                      handleAttendance(
                        worker.id,
                        "Half Day",
                        selectedSites[
                          worker.id
                        ] || worker.siteId
                      )
                    }
                    className={`rounded-xl py-2 border text-xs font-bold ${
                      currentStatus === "Half Day"
                        ? "bg-amber-500/20 border-amber-500 text-amber-400"
                        : "border-stone-700 text-stone-400"
                    }`}
                  >
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    Half
                  </button>

                  {/* ABSENT */}
                  <button
                    onClick={() =>
                      handleAttendance(
                        worker.id,
                        "Absent",
                        selectedSites[
                          worker.id
                        ] || worker.siteId
                      )
                    }
                    className={`rounded-xl py-2 border text-xs font-bold ${
                      currentStatus === "Absent"
                        ? "bg-red-500/20 border-red-500 text-red-400"
                        : "border-stone-700 text-stone-400"
                    }`}
                  >
                    <X className="h-4 w-4 mx-auto mb-1" />
                    Absent
                  </button>

                  {/* RESET */}
                  <button
                    onClick={() =>
                      handleAttendance(
                        worker.id,
                        "Reset",
                        selectedSites[
                          worker.id
                        ] || worker.siteId
                      )
                    }
                    className="rounded-xl py-2 border border-stone-700 text-stone-400 text-xs font-bold"
                  >
                    <RotateCcw className="h-4 w-4 mx-auto mb-1" />
                    Reset
                  </button>
                </div>

                {/* BOTTOM ATTENDANCE */}
                <div className="mt-4 pt-3 border-t border-stone-800">

                  <div className="flex justify-between items-center">

                    <span className="text-xs text-stone-500">
                      Attendance Status
                    </span>

                    <span
                      className={`text-xs font-bold ${
                        currentStatus === "Present"
                          ? "text-emerald-400"
                          : currentStatus ===
                            "Half Day"
                          ? "text-amber-400"
                          : currentStatus ===
                            "Absent"
                          ? "text-red-400"
                          : "text-stone-500"
                      }`}
                    >
                      {currentStatus}
                    </span>
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}