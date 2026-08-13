"use server";
import { Suspense } from "react";
import ProjectInfo from "@/components/project/Project";
import { ProjectType } from "@/types/project";
import React from "react";
import Spinner from "@/app/loading";
import { Metadata } from "next";
import { getProjectById } from "@/services/serverServices/project/getProjectById";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const { success, data, message } = await getProjectById({ id });

  if (!success || !data) {
    console.error("Failed to generate metadata for project:", message);
    return {
      title: "Project Not Found",
      description: "The requested project could not be found",
    };
  }
  const project = data as ProjectType;
  const imageUrl = `${project.thumbnail.url}?v=${new Date(
    project.publishedAt,
  ).getTime()}`;

  return {
    metadataBase: new URL("https://rf.suniljangir.in"),
    title: project.title,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      url: `https://rf.suniljangir.in/project/${project._id}`,
      siteName: "radiatorforge",

      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: [imageUrl],
    },
  };
}

const Project = async ({ params }: ProjectPageProps) => {
  const { id } = await params;

  const { success, data, message } = await getProjectById({ id });
  if (!success || !data) {
    return (
      <div className="my-8 w-full text-center text-lg font-medium text-red-500">
        {message || "Project not found"}
      </div>
    );
  }

  const project = data as ProjectType;

  return (
    <Suspense fallback={<Spinner />}>
      <ProjectInfo project={project} />
    </Suspense>
  );
};

export default Project;
