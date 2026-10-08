"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { listenData } from "@/lib/db";

export default function WorkingDaysWeeklyPage() {
  const { user } = useAuth();

  const [workers, setWorkers] = useState({});
  const [attendance, setAttendance] = useState({});

  // 💰 PAYMENT WAGE (your father payment)
  const PAYMENT_WAGE = 1250;

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!user) return;

    const unsubWorkers = listenData(user.uid, "workers", (data) => {
      setWorkers(data || {});
    });

    const unsubAttendance = listenData(user.uid, "attendance", (data) => {
      setAttendance(data || {});
    });

    return () => {
      unsubWorkers();
      unsubAttendance();
    };
  }, [user]);

  // ================= MON - SAT WEEK =================
  const getWeekDates = () => {
    const today = new Date();

    const day = today.getDay(); // 0 = Sun, 1 = Mon
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);

    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d.toISOString().split("T")[0];
    });
  };

  const weekDates = useMemo(() => getWeekDates(), []);

  // ================= CALCULATION =================
  const summary = useMemo(() => {
    const result = [];

    Object.entries(workers).forEach(([workerId, worker]) => {
      let workingDays = 0;

      // 🔥 ONLY MON-SAT ATTENDANCE
      weekDates.forEach((date) => {
        const day = attendance?.[date];
        if (!day) return;

        const entry = day[workerId];

        if (!entry) return;

        // CASE 1: simple string
        if (entry === "Present") workingDays += 1;
        if (entry === "Half Day") workingDays += 0.5;

        // CASE 2: object format
        if (entry?.status === "Present") workingDays += 1;
        if (entry?.status === "Half Day") workingDays += 0.5;
      });

      const totalSalary = workingDays * PAYMENT_WAGE;

      result.push({
        id: workerId,
        name: worker.name || "Worker",
        workingDays,
        totalSalary,
      });
    });

    return result;
  }, [workers, attendance, weekDates]);

  // ================= UI =================
  return (
    <div className="p-4 text-white">

      <h1 className="text-2xl font-bold mb-4">
        Weekly Salary (Mon - Sat) ₹1250
      </h1>

      <div className="space-y-3">

        {summary.map((worker) => (
          <div
            key={worker.id}
            className="bg-zinc-900 rounded-lg p-4 flex justify-between items-center"
          >
            <span className="font-medium">
              {worker.name}
            </span>

            <span className="text-green-400 font-semibold">
              {worker.workingDays} × ₹{PAYMENT_WAGE} = ₹
              {worker.totalSalary}
            </span>
          </div>
        ))}

        {summary.length === 0 && (
          <p className="text-zinc-400">
            No workers found or attendance not marked.
          </p>
        )}

      </div>
    </div>
  );
}