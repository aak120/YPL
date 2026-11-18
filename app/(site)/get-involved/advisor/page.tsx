import type { Metadata } from "next";
import { PathwayPage } from "@/components/PathwayPage";
import { getPathway } from "@/lib/pathways";

export const metadata: Metadata = {
  title: "Advisory Network",
  description: "Apply to advise Youth Policy Lab: review research, mentor young researchers and contribute expertise.",
  alternates: { canonical: "/get-involved/advisor" },
};

export default function Page() {
  return <PathwayPage p={getPathway("advisor")} formTitle="Advisor application" submitLabel="Submit expression of interest" />;
}
