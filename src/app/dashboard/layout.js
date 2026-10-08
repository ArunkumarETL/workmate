"use client";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { useState } from "react";
import {Clock3} from "lucide-react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  CalendarCheck,
  Banknote,
} from "lucide-react";

export default function DashboardLayout({
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={isOpen}
        setSidebarOpen={setIsOpen}
      />

      {/* Main Section */}
      <div className="flex-1 flex flex-col">

        {/* Topbar */}
        <Topbar setIsOpen={setIsOpen} />

        {/* Main Content */}
        <main className="flex-1 p-4  overflow-y-auto" style={{ paddingBottom: "120px" }}>
          {children}
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-zinc-800 flex items-center justify-around z-50">

        <a
          href="/dashboard"
          className="flex flex-col items-center text-zinc-300 hover:text-amber-400 text-xs"
        >
          <LayoutDashboard size={20} />
          <span>Home</span>
        </a>

        <a
          href="/dashboard/sites"
          className="flex flex-col items-center text-zinc-300 hover:text-amber-400 text-xs"
        >
          <Building2 size={20} />
          <span>Sites</span>
        </a>

        <a
          href="/dashboard/workers"
          className="flex flex-col items-center text-zinc-300 hover:text-amber-400 text-xs"
        >
          <Users size={20} />
          <span>Workers</span>
        </a>

        <a
          href="/dashboard/attendance"
          className="flex flex-col items-center text-zinc-300 hover:text-amber-400 text-xs"
        >
          <CalendarCheck size={20} />
          <span>Attendance</span>
        </a>

        <a
          href="/dashboard/salary"
          className="flex flex-col items-center text-zinc-300 hover:text-amber-400 text-xs"
        >
          <Banknote size={20} />
          <span>Salary</span>
        </a>
        <Link
          href="/dashboard/worker-summary"
          className="flex flex-col items-center text-zinc-300 hover:text-amber-400 text-xs"
        >
          <Clock3 size={20} />
          <span>Days</span>
        </Link>

      </div>
    </div>
  );
}