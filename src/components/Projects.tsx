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

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchProjects = async () => {
    try {
      const response = await axios.get<Project[]>(`${apiUrl}/api/portfolio`);
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="container h-full pt-20">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col space-y-2">
          <h3 className="text-blue-500 text-2xl lg:text-4xl font-bold">
            &lt;imagine and create&gt;
          </h3>
          <p className="lg:text-xl">Here are some of my works.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-3 flex justify-center items-center font-bold text-gray-800 text-2xl">
              Loading...{" "}
            </div>
          ) : (
            projects.map((project: Project) => (
              <FeatureCard key={project._id} project={project} />
            ))
          )}
        </div>

        <div className="self-end">
          <h3 className="text-blue-500 text-2xl font-bold">
            &lt;imagine and create&gt;
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Projects;
