import type { Pathway } from "./types";

export interface PathwayInfo {
  id: Pathway;
  href: string;
  title: string;
  short: string;
  intro: string;
  who: string[];
  responsibilities: string[];
  expectations: string[];
  process: string[];
  note?: string;
}

export const pathways: PathwayInfo[] = [
  {
    id: "team",
    href: "/get-involved/team-member",
    title: "Team Member",
    short: "Research, analyse, write and communicate policy work as part of a YPL team.",
    intro:
      "Team members do YPL's core work: framing research questions, reviewing evidence, collecting and analysing data, drafting papers and briefs, and getting finished work to the people who need it. No prior research experience is required — curiosity, care and reliability matter more.",
    who: [
      "Students and young people with a serious interest in public policy",
      "Writers, analysts, designers, organisers and communicators",
      "People willing to learn research methods and accept editorial feedback",
    ],
    responsibilities: [
      "Contribute to research projects, policy papers or Gurgaon briefs",
      "Review literature and data, and record sources accurately",
      "Take part in internal review of colleagues' drafts",
      "Support communications, outreach or events depending on your team",
    ],
    expectations: [
      "A realistic time commitment you can sustain — usually 2–6 hours a week",
      "Meeting agreed deadlines, or flagging early when you can't",
      "Academic honesty: no plagiarism, fabricated data or undisclosed AI-generated text",
      "Applicants under 18 should make sure a parent or guardian is aware they are applying",
    ],
    process: [
      "Submit the application form",
      "The team reviews applications on a rolling basis",
      "Shortlisted applicants are invited to a short conversation or task",
      "Successful applicants are matched to a team and project",
    ],
    note: "Teams: Research · Policy Analysis · Data Analysis · Editorial · Communications · Outreach · Events",
  },
  {
    id: "board",
    href: "/get-involved/board",
    title: "Board Member",
    short: "Help govern YPL and shape its direction, standards and growth.",
    intro:
      "The board is responsible for YPL's direction and integrity: setting priorities, safeguarding research standards, overseeing operations and helping the organisation grow responsibly. It is a governance role, distinct from day-to-day research work, and suits applicants who have already led teams or built something.",
    who: [
      "Applicants with demonstrable leadership or organisational experience",
      "People who think about institutions, not just individual projects",
      "Those able to commit to regular meetings over at least a year",
    ],
    responsibilities: [
      "Attend board meetings and contribute to decisions",
      "Help set YPL's research agenda and annual priorities",
      "Uphold editorial independence, ethics and safeguarding",
      "Take on a portfolio — e.g. partnerships, operations or communications",
    ],
    expectations: [
      "A minimum term of one year",
      "Preparation for meetings and follow-through on agreed actions",
      "Discretion with internal and applicant information",
      "Disclosure of any conflicts of interest",
    ],
    process: [
      "Submit the board application",
      "Applications are reviewed by current leadership",
      "Shortlisted candidates are invited to a conversation",
      "Appointments are made when board places are available",
    ],
    note: "Submitting an application does not guarantee a board position. Places are limited and appointments depend on YPL's needs at the time.",
  },
  {
    id: "advisor",
    href: "/get-involved/advisor",
    title: "Advisor",
    short: "Review research, mentor young researchers and lend expertise.",
    intro:
      "Advisors strengthen the quality of YPL's work. They review drafts, point researchers to better evidence, share practical knowledge of how policy is made, and mentor team members. Advisors come from many backgrounds — academics, practitioners, civil servants, journalists, graduate students and professionals early in their careers alike.",
    who: [
      "Researchers, practitioners and professionals with relevant subject knowledge",
      "Graduate students and early-career professionals as well as senior experts",
      "People who enjoy mentoring and giving constructive feedback",
    ],
    responsibilities: [
      "Review draft papers or briefs in your area of expertise",
      "Mentor individual researchers or project teams",
      "Offer strategic or subject-matter guidance when asked",
      "Occasionally speak at, or attend, YPL events",
    ],
    expectations: [
      "Involvement is flexible and agreed with you in advance",
      "Advisors are not responsible for, and need not endorse, YPL's conclusions",
      "Advisors are listed publicly only with their explicit permission",
      "Interactions with team members under 18 follow YPL's safeguarding practices",
    ],
    process: [
      "Submit the advisory application",
      "YPL leadership reviews it and may follow up by email",
      "We agree the scope and form of your involvement together",
    ],
  },
];

export const getPathway = (id: Pathway) => pathways.find((p) => p.id === id)!;
