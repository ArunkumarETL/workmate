"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { CalendarClock } from "lucide-react";

import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Banknote,
  FileSpreadsheet,
  Settings,
  LogOut,
  Hammer,
} from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Work Sites",
      href: "/dashboard/sites",
      icon: Building2,
    },
    {
      name: "Workers",
      href: "/dashboard/workers",
      icon: Users,
    },
    {
      name: "Attendance",
      href: "/dashboard/attendance",
      icon: CalendarCheck,
    },
    {
      name: "Salary Ledger",
      href: "/dashboard/salary",
      icon: Banknote,
    },
    {
      name: "PDF Reports",
      href: "/dashboard/reports",
      icon: FileSpreadsheet,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
    {
      name:"summary",
      href:"/dashboard/worker-summary",
      icon: Banknote,
    },
    {
      name:"Working Days",
      href:"/dashboard/worker-days",
      icon: CalendarClock,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      setSidebarOpen(false);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-50
          w-64 h-screen
          bg-black
          border-r border-zinc-900
          text-white
          flex flex-col
          transition-transform duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          md:translate-x-0
          md:relative
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-900 flex items-center gap-2">
          <Hammer className="text-amber-500" />
          <span className="font-bold text-lg">
            WorkMate
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 pb-28">
          {navItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={`
                  flex items-center gap-3
                  p-3 rounded-lg
                  transition-all duration-200

                  ${
                    active
                      ? "bg-zinc-900 text-amber-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }
                `}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Fixed Footer */}
        <div className="sticky bottom-0 p-3 border-t border-zinc-900 bg-black">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 rounded-lg text-red-400 hover:bg-zinc-900 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}