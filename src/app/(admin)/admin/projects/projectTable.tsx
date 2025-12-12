import React from 'react'

interface Project {
  _id: string
  title: string
  description: string
  technology: string[]
  githubLink: string
  liveLink: string
  img: string
}

interface ProjectTableProps {
  projects: Project[]
  onDelete: (id: string) => void
  onUpdate: (id: string) => void
}

export default function ProjectTable({ projects, onDelete, onUpdate }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
        <thead className="bg-slate-50 dark:bg-slate-900/70">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Title</th>
            <th className="px-4 py-3 text-left font-semibold">Description</th>
            <th className="px-4 py-3 text-left font-semibold">Technologies</th>
            <th className="px-4 py-3 text-left font-semibold">GitHub</th>
            <th className="px-4 py-3 text-left font-semibold">Live</th>
            <th className="px-4 py-3 text-left font-semibold">Image</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-800 dark:bg-slate-950/40">
          {projects.map((project) => (
            <tr key={project._id} className="hover:bg-slate-900/60">
              <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{project.title}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{project.description}</td>
              <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{project.technology.join(', ')}</td>
              <td className="px-4 py-3">
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline dark:text-sky-400">
                  GitHub
                </a>
              </td>
              <td className="px-4 py-3">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-sky-600 hover:underline dark:text-sky-400">
                  Live
                </a>
              </td>
              <td className="px-4 py-3">
                <img src={project.img} alt={project.title} className="h-14 w-14 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-800" />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => onUpdate(project._id)}
                    className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:bg-slate-800"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => onDelete(project._id)}
                    className="rounded-lg border border-red-500/60 px-3 py-1 text-xs font-semibold text-red-600 transition hover:border-red-400 hover:bg-red-500/10 dark:text-red-200"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
