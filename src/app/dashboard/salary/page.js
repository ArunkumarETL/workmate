"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { listenData } from "@/lib/db";
import jsPDF from "jspdf";
import dayjs from "dayjs";

export default function WeeklyReportsPage() {
  const { user } = useAuth();

  const [sites, setSites] = useState({});
  const [attendance, setAttendance] = useState({});
  const [generating, setGenerating] = useState(false);

  // 🟦 OFFICIAL WAGE (5th icon)
  const OFFICIAL_WAGE = 1300;

  // 🟩 PAYMENT WAGE (6th icon use only if needed)
  const PAYMENT_WAGE = 1250;

  const [weekStart, setWeekStart] = useState(() =>
    dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD")
  );

  const weekDates = useMemo(() => {
    const start = dayjs(weekStart);

    return Array.from({ length: 6 }).map((_, i) =>
      start.add(i, "day").format("YYYY-MM-DD")
    );
  }, [weekStart]);

  // ================= LOAD DATA =================
  useEffect(() => {
    if (!user) return;

    const unsubSites = listenData(user.uid, "sites", (data) => {
      setSites(data || {});
    });

    const unsubAttendance = listenData(user.uid, "attendance", (data) => {
      setAttendance(data || {});
    });

    return () => {
      unsubSites();
      unsubAttendance();
    };
  }, [user]);

  // ================= REPORT (OFFICIAL ONLY - 5th ICON) =================
  const report = useMemo(() => {
    const result = {};
    let grandTotalSalary = 0;

    Object.keys(sites).forEach((siteId) => {
      result[siteId] = {
        siteName: sites[siteId]?.siteName || "Site",
        days: {
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
        },
        totalWorkers: 0,
        totalSalary: 0,
      };
    });

    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    weekDates.forEach((date, index) => {
      const dayName = dayNames[index];

      const dailyAttendance = attendance?.[date] || {};

      Object.keys(dailyAttendance).forEach((workerId) => {
        const entry = dailyAttendance[workerId];

        if (!entry) return;

        if (
          entry.status === "Present" ||
          entry.status === "Half Day"
        ) {
          const siteId = entry.siteId;

          if (!siteId || !result[siteId]) return;

          const value =
            entry.status === "Half Day" ? 0.5 : 1;

          result[siteId].days[dayName] += value;
          result[siteId].totalWorkers += value;
        }
      });
    });

    // 🟦 OFFICIAL CALCULATION (IMPORTANT)
    Object.keys(result).forEach((siteId) => {
      result[siteId].totalSalary =
        result[siteId].totalWorkers * OFFICIAL_WAGE;

      grandTotalSalary += result[siteId].totalSalary;
    });

    return { sites: result, grandTotalSalary };
  }, [attendance, sites, weekDates]);

  // ================= PDF =================
  const generatePDF = () => {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(18);
    doc.text("WEEKLY SITE REPORT (OFFICIAL)", 20, y);

    y += 15;

    Object.keys(report.sites).forEach((siteId) => {
      const site = report.sites[siteId];

      doc.setFontSize(14);
      doc.text(site.siteName.toUpperCase(), 20, y);
      y += 10;

      Object.keys(site.days).forEach((day) => {
        doc.setFontSize(12);
        doc.text(`${day} - ${site.days[day]}`, 25, y);
        y += 8;
      });

      y += 5;

      doc.text(`Total Workers: ${site.totalWorkers}`, 25, y);
      y += 10;

      doc.text(
        `Total Salary: ${site.totalWorkers} × ${OFFICIAL_WAGE} = ${site.totalSalary}`,
        25,
        y
      );

      y += 20;

      if (y > 250) {
        doc.addPage();
        y = 20;
      }
    });

    doc.setFontSize(16);
    doc.text(
      `GRAND TOTAL: ${report.grandTotalSalary}`,
      20,
      y
    );

    doc.save(`Weekly_Report_${weekDates[0]}.pdf`);
  };

  // ================= UI =================
  return (
    <div className="p-6 text-white space-y-6">

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Weekly Report (OFFICIAL - ₹1300)
          </h1>
          <p className="text-sm text-stone-400">
            This page is for office calculation only
          </p>
        </div>

        <div className="flex gap-3">
          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="bg-stone-900 px-4 py-2 rounded-xl"
          />

          <button
            onClick={generatePDF}
            className="bg-green-600 px-5 py-2 rounded-xl"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="space-y-5">
        {Object.keys(report.sites).map((siteId) => {
          const site = report.sites[siteId];

          return (
            <div
              key={siteId}
              className="bg-stone-900 p-5 rounded-xl"
            >
              <h2 className="text-xl font-bold mb-4">
                {site.siteName}
              </h2>

              {Object.keys(site.days).map((day) => (
                <div
                  key={day}
                  className="flex justify-between"
                >
                  <span>{day}</span>
                  <span>{site.days[day]}</span>
                </div>
              ))}

              <div className="border-t mt-3 pt-3">
                <p>Total Workers: {site.totalWorkers}</p>

                <p className="text-green-400 font-bold">
                  {site.totalWorkers} × {OFFICIAL_WAGE} ={" "}
                  {site.totalSalary}
                </p>
              </div>
            </div>
          );
        })}

        <div className="bg-green-900/20 p-5 rounded-xl">
          <h2 className="text-xl font-bold text-green-400">
            GRAND TOTAL: {report.grandTotalSalary}
          </h2>
        </div>
      </div>
    </div>
  );
}