"use client";

import ExperienceForm from "../../ExperienceForm";

export default function EditExperiencePage({
  params,
}: {
  params: { id: string };
}) {
  return <ExperienceForm id={params.id} />;
}
