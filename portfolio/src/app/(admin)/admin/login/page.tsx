"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { dispatch, currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser?.accessToken) {
      router.push(currentUser.isAdmin ? "/admin" : "/");
    }
  }, [currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const response = await axios.post("/api/auth/login", { email, password })
      
      if (response.data.success) {
        dispatch({ type: "LOGIN", payload: response.data.data });

        if (response.data.data?.isAdmin) {
          router.push("/admin");
        }else{
          router.push("/");
        }
      }
      setError(response.data.message)

    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 dark:bg-slate-950">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-6 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Admin
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Sign in</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Access the control panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-500 shadow-inner focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
          {error && (
            <div
              className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-200"
              role="alert"
            >
              <span className="block">{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-[1px] hover:bg-sky-400"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
