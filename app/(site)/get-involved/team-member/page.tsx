import type { Metadata } from "next";
import { PathwayPage } from "@/components/PathwayPage";
import { getPathway } from "@/lib/pathways";

export const metadata: Metadata = {
  title: "Join the Team",
  description: "Apply to join Youth Policy Lab as a researcher, analyst, editor, communicator or organiser.",
  alternates: { canonical: "/get-involved/team-member" },
};

export default function Page() {
  return <PathwayPage p={getPathway("team")} formTitle="Team member application" submitLabel="Submit application" />;
}
