"use client";
import ProjectForm from "../../ProjectForm";

function UpdateProject({ params }: { params: { slug: string } }) {
  return (
    <div>
      <ProjectForm slug={params?.slug} />
    </div>
  );
}

export default UpdateProject;
