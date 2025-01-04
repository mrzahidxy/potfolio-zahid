"use client";

import { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("currentUser");
    router.push("/admin/login");
  }, [router]);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Welcome to Dashboard</h1>

      <Link href="/admin/projects" className="text-blue-500 text-xl mr-4">
        Project List
      </Link>

      <button
        type="button"
        className="cursor-pointer text-blue-500 text-xl"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}
