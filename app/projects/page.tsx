"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { demoProjects, Project } from "@/data/projects";

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = new Set(demoProjects.map((project) => project.category));
    return ["All", ...Array.from(uniqueCategories).sort()];
  }, []);

  const filteredProjects = useMemo(() => {
    let projects = demoProjects;

    if (selectedCategory !== "All") {
      projects = projects.filter((project) => project.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      projects = projects.filter(
        (project) =>
          project.title.toLowerCase().includes(lowerCaseQuery) ||
          project.description.toLowerCase().includes(lowerCaseQuery) ||
          project.technologies.some((tech) => tech.toLowerCase().includes(lowerCaseQuery))
      );
    }
    return projects;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-6xl bg-white dark:bg-gray-900 shadow-lg rounded-lg p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-center text-black dark:text-white sm:text-5xl">
          Our Projects
        </h1>

        {/* Search and Filter Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search projects..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200
                  ${
                    selectedCategory === category
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-200 text-gray-800 hover:bg-blue-100 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-blue-800"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.title} // Using title as key, assuming titles are unique for demo
                className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill // Use fill prop directly
                    className="object-cover transition-transform duration-300 hover:scale-105" // object-cover class
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 flex-grow">
                    {project.description}
                  </p>
                  <div className="mb-4">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Technologies:{" "}
                    </span>
                    <span className="text-sm text-gray-800 dark:text-gray-200">
                      {project.technologies.join(", ")}
                    </span>
                  </div>
                  <Link
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-auto px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-center"
                  >
                    View Project
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            No projects found matching your criteria.
          </p>
        )}
      </main>
    </div>
  );
};

export default ProjectsPage;
