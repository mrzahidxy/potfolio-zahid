"use client";

import React, { useEffect, useState } from "react";
import FeatureCard from "./common/FeatureCard";
import axios from "axios";

interface Project {
  description: string;
  img: string;
  technology: Array<string>;
  githubLink: string;
  liveLink: string;
  title: string;
  _id?: string;
}

interface ProjectApiResponse {
  data: Project[];
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchProjects = async () => {
    try {
      const response = await axios.get<ProjectApiResponse>(
        `${apiUrl}/projects`
      );
      setProjects(response.data.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Calculate how many blank boxes are needed to make 6 total
  const blankBoxes = Array.from({ length: Math.max(0, 6 - projects.length) });

  return (
    <div className="container space-y-8 p-4 lg:p-0">
      <div className="flex flex-col space-y-2">
        <h3 className="text-blue-500 text-2xl lg:text-4xl font-bold">
          &lt;imagine and create&gt;
        </h3>
        <p className="lg:text-xl">Here are some of my works.</p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full flex justify-center items-center font-bold text-gray-800 text-2xl">
            Loading...
          </div>
        ) : (
          <>
            {/* Render project cards */}
            {projects.map((project: Project) => (
              <FeatureCard key={project._id} project={project} />
            ))}

            {/* Render blank boxes to fill up to 8 total */}
            {blankBoxes.map((_, index) => (
              <div
                key={`blank-${index}`}
                className="h-40 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg"
              >
                <span className="text-gray-400">No Project</span>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="self-end">
        <h3 className="text-blue-500 text-2xl font-bold">
          &lt;imagine and create&gt;
        </h3>
      </div>
    </div>
  );
};

export default Projects;
