import type { Metadata } from "next";
import { PathwayPage } from "@/components/PathwayPage";
import { getPathway } from "@/lib/pathways";

export const metadata: Metadata = {
  title: "Board Membership",
  description: "Apply to join Youth Policy Lab's board — a governance and leadership role.",
  alternates: { canonical: "/get-involved/board" },
};

export default function Page() {
  return <PathwayPage p={getPathway("board")} formTitle="Board application" submitLabel="Submit board application" />;
}
