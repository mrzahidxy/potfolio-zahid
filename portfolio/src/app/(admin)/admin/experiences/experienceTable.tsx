import React from "react";

interface ExperienceRow {
  id?: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  summary: string;
}

interface ExperienceTableProps {
  experiences: ExperienceRow[];
  onDelete: (id: string) => void;
  onUpdate: (id: string) => void;
  busyAction: string | null;
}

export default function ExperienceTable({
  experiences,
  onDelete,
  onUpdate,
  busyAction,
}: ExperienceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
        <thead className="bg-slate-50 dark:bg-slate-900/70">
          <tr>
            <th className="w-[22%] px-4 py-3 text-left font-semibold">Role</th>
            <th className="w-[18%] px-4 py-3 text-left font-semibold">Company</th>
            <th className="w-[16%] px-4 py-3 text-left font-semibold">Period</th>
            <th className="w-[14%] px-4 py-3 text-left font-semibold">Location</th>
            <th className="w-[20%] px-4 py-3 text-left font-semibold">Summary</th>
            <th className="w-[10rem] px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/20">
          {experiences.map((experience, index) => (
            <tr
              key={experience.id ?? `${experience.company}-${experience.period}`}
              className="align-top transition hover:bg-slate-50 dark:hover:bg-slate-900/40"
            >
              <td className="px-4 py-3">
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {experience.role}
                  </p>
                  {index === 0 && experience.period.includes("Present") ? (
                    <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                      Current
                    </span>
                  ) : null}
                </div>
              </td>
              <td className="px-4 py-3 leading-7 text-slate-600 dark:text-slate-300">
                {experience.company}
              </td>
              <td className="px-4 py-3 leading-7 text-slate-600 dark:text-slate-300">
                {experience.period}
              </td>
              <td className="px-4 py-3 leading-7 text-slate-600 dark:text-slate-300">
                {experience.location || "-"}
              </td>
              <td className="max-w-sm px-4 py-3 leading-7 text-slate-600 dark:text-slate-300">
                {experience.summary}
              </td>
              <td className="px-4 py-3">
                <div className="flex min-w-[9rem] flex-col items-stretch gap-2">
                  <button
                    type="button"
                    onClick={() => experience.id && onUpdate(experience.id)}
                    disabled={Boolean(busyAction) || !experience.id}
                    className="rounded-md border border-slate-300 px-3 py-1.5 text-center text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={() => experience.id && onDelete(experience.id)}
                    disabled={Boolean(busyAction) || !experience.id}
                    className="rounded-md border border-red-500/50 px-3 py-1.5 text-center text-xs font-medium text-red-600 transition hover:border-red-400 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:text-red-200"
                  >
                    {busyAction === `delete-${experience.id}` ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
