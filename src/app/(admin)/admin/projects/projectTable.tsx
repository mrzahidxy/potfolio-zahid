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
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Technologies</th>
            <th className="px-4 py-2 text-left">GitHub</th>
            <th className="px-4 py-2 text-left">Live</th>
            <th className="px-4 py-2 text-left">Image</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id} className="border-t border-gray-300">
              <td className="px-4 py-2">{project.title}</td>
              <td className="px-4 py-2">{project.description}</td>
              <td className="px-4 py-2">{project.technology.join(', ')}</td>
              <td className="px-4 py-2">
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  GitHub
                </a>
              </td>
              <td className="px-4 py-2">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Live
                </a>
              </td>
              <td className="px-4 py-2">
                <img src={project.img} alt={project.title} className="w-16 h-16 object-cover" />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => onUpdate(project._id)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600"
                >
                  Update
                </button>
                <button
                  onClick={() => onDelete(project._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}