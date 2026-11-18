/**
 * Form definitions. One source of truth for the field list, labels, options
 * and validation rules — used to render the forms in the browser and to
 * re-validate submissions on the server.
 */

export type FieldType = "text" | "email" | "url" | "textarea" | "select" | "radio" | "checkboxes" | "consent";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  help?: string;
  placeholder?: string;
  options?: string[];
  maxLength?: number;
  minLength?: number;
  /** Max number of selections for checkboxes */
  maxSelect?: number;
  /** Only shown + required when another field has one of these values */
  showIf?: { field: string; values: string[] };
  half?: boolean;
  autoComplete?: string;
}

export interface FormSection {
  legend: string;
  fields: Field[];
}

export interface FormDef {
  id: "team" | "board" | "advisor" | "contact";
  sections: FormSection[];
}

const consentField: Field = {
  name: "consent",
  label:
    "I have read the privacy notice and consent to Youth Policy Lab storing this information to review my application. I understand it will not be published and that I can ask for it to be deleted.",
  type: "consent",
  required: true,
};

export const teamForm: FormDef = {
  id: "team",
  sections: [
    {
      legend: "About you",
      fields: [
        { name: "full_name", label: "Full name", type: "text", required: true, maxLength: 120, half: true, autoComplete: "name" },
        { name: "email", label: "Email", type: "email", required: true, maxLength: 200, half: true, autoComplete: "email" },
        {
          name: "age_range",
          label: "Age range",
          type: "select",
          required: true,
          options: ["Under 16", "16–17", "18–24", "25 or older"],
          help: "We ask only to apply appropriate safeguards for younger members.",
          half: true,
        },
        { name: "location", label: "City and country", type: "text", maxLength: 120, half: true, placeholder: "e.g. Gurugram, India", help: "City only — please don't share your address." },
        { name: "organisation", label: "School, university or organisation", type: "text", maxLength: 160 },
        {
          name: "guardian_aware",
          label: "A parent or guardian is aware that I am applying to volunteer with YPL.",
          type: "consent",
          required: true,
          showIf: { field: "age_range", values: ["Under 16", "16–17"] },
        },
      ],
    },
    {
      legend: "Interests and role",
      fields: [
        {
          name: "department",
          label: "Which team would you most like to join?",
          type: "radio",
          required: true,
          options: ["Research", "Policy analysis", "Data analysis", "Editorial", "Communications", "Outreach", "Events", "Not sure yet"],
        },
        {
          name: "interests",
          label: "Policy areas of interest",
          type: "checkboxes",
          required: true,
          maxSelect: 4,
          help: "Choose up to four.",
          options: [
            "Economics & Development",
            "Governance & Public Policy",
            "Technology & Society",
            "Urban Affairs",
            "Climate & Sustainability",
            "International Relations",
            "Gurugram / local policy",
          ],
        },
        { name: "skills", label: "Relevant skills", type: "textarea", required: true, maxLength: 800, placeholder: "e.g. academic writing, Excel or R, survey design, graphic design, public speaking…" },
        { name: "experience", label: "Previous experience", type: "textarea", maxLength: 1200, help: "Research projects, essays, MUN, debate, journalism, clubs, internships — anything relevant." },
      ],
    },
    {
      legend: "Your application",
      fields: [
        {
          name: "motivation",
          label: "Why do you want to join Youth Policy Lab?",
          type: "textarea",
          required: true,
          minLength: 80,
          maxLength: 1500,
        },
        {
          name: "statement",
          label: "Describe a policy problem you think deserves more attention, and how you would begin researching it.",
          type: "textarea",
          required: true,
          minLength: 80,
          maxLength: 2000,
          help: "Around 150–300 words. We are looking for clear thinking, not polished prose.",
        },
        {
          name: "availability",
          label: "Expected time commitment",
          type: "select",
          required: true,
          options: ["Up to 2 hours a week", "2–4 hours a week", "4–6 hours a week", "More than 6 hours a week", "Varies — project-based"],
          half: true,
        },
        { name: "portfolio", label: "Portfolio or writing sample link", type: "url", maxLength: 300, half: true, placeholder: "https://" },
        consentField,
      ],
    },
  ],
};

export const boardForm: FormDef = {
  id: "board",
  sections: [
    {
      legend: "About you",
      fields: [
        { name: "full_name", label: "Full name", type: "text", required: true, maxLength: 120, half: true, autoComplete: "name" },
        { name: "email", label: "Email", type: "email", required: true, maxLength: 200, half: true, autoComplete: "email" },
        { name: "organisation", label: "Current school, university or organisation", type: "text", maxLength: 160 },
        {
          name: "interests",
          label: "Areas you would like to contribute to",
          type: "checkboxes",
          required: true,
          options: ["Research agenda & quality", "Strategy & growth", "Partnerships & outreach", "Finance & operations", "Governance & ethics", "Communications & public profile", "Events & convenings"],
        },
      ],
    },
    {
      legend: "Leadership experience",
      fields: [
        {
          name: "leadership",
          label: "Describe your experience in leadership or organisational work.",
          type: "textarea",
          required: true,
          minLength: 80,
          maxLength: 1500,
          help: "Roles you have held, teams you have led or organisations you have helped build.",
        },
        { name: "accomplishments", label: "Relevant accomplishments", type: "textarea", maxLength: 1200, help: "Projects delivered, initiatives started, research, awards — whatever best shows your work." },
      ],
    },
    {
      legend: "Your statement",
      fields: [
        { name: "motivation", label: "Why do you wish to join the YPL board?", type: "textarea", required: true, minLength: 80, maxLength: 1500 },
        {
          name: "ideas",
          label: "What would you prioritise for YPL's development over the next year?",
          type: "textarea",
          required: true,
          minLength: 80,
          maxLength: 2000,
        },
        {
          name: "commitment",
          label: "Time commitment",
          type: "select",
          required: true,
          options: ["Monthly board meeting only", "Monthly meeting plus 2–3 hours a month", "Monthly meeting plus a portfolio (4+ hours a month)"],
          half: true,
        },
        { name: "cv_link", label: "CV, portfolio or LinkedIn", type: "url", maxLength: 300, half: true, placeholder: "https://" },
        consentField,
      ],
    },
  ],
};

export const advisorForm: FormDef = {
  id: "advisor",
  sections: [
    {
      legend: "About you",
      fields: [
        { name: "full_name", label: "Full name", type: "text", required: true, maxLength: 120, half: true, autoComplete: "name" },
        { name: "email", label: "Email", type: "email", required: true, maxLength: 200, half: true, autoComplete: "email" },
        { name: "title", label: "Current role or title", type: "text", required: true, maxLength: 160, half: true, placeholder: "e.g. Urban planner, PhD candidate, Policy analyst" },
        { name: "organisation", label: "Organisation", type: "text", maxLength: 160, half: true },
        { name: "expertise", label: "Area(s) of expertise", type: "text", required: true, maxLength: 250, placeholder: "e.g. water governance, public finance, survey methods" },
        { name: "website", label: "LinkedIn or professional website", type: "url", maxLength: 300, placeholder: "https://" },
      ],
    },
    {
      legend: "Background",
      fields: [
        { name: "bio", label: "Short professional biography", type: "textarea", required: true, minLength: 60, maxLength: 1200, help: "Around 100–200 words." },
        { name: "experience", label: "Relevant experience", type: "textarea", maxLength: 1500, help: "Research, practice, teaching, mentoring or policy work relevant to YPL." },
      ],
    },
    {
      legend: "How you would contribute",
      fields: [
        {
          name: "contribution_types",
          label: "Preferred forms of involvement",
          type: "checkboxes",
          required: true,
          options: ["Research review", "Mentorship", "Subject-matter expertise", "Strategic guidance", "Event participation", "Publication feedback"],
        },
        { name: "contribution", label: "How could you contribute to YPL?", type: "textarea", required: true, minLength: 40, maxLength: 1500 },
        {
          name: "involvement",
          label: "Expected level of involvement",
          type: "select",
          required: true,
          options: ["Occasional — a few requests a year", "Regular — roughly monthly", "Project-specific", "Open to discussion"],
        },
        consentField,
      ],
    },
  ],
};

export const contactForm: FormDef = {
  id: "contact",
  sections: [
    {
      legend: "Your message",
      fields: [
        { name: "full_name", label: "Name", type: "text", required: true, maxLength: 120, half: true, autoComplete: "name" },
        { name: "email", label: "Email", type: "email", required: true, maxLength: 200, half: true, autoComplete: "email" },
        {
          name: "inquiry_type",
          label: "Type of enquiry",
          type: "select",
          required: true,
          options: ["General enquiry", "Research collaboration", "Partnership", "Advisor enquiry", "Media", "Correction to a publication"],
          half: true,
        },
        { name: "organisation", label: "Organisation", type: "text", maxLength: 160, half: true },
        { name: "subject", label: "Subject", type: "text", required: true, maxLength: 200 },
        { name: "message", label: "Message", type: "textarea", required: true, minLength: 20, maxLength: 4000 },
        {
          name: "consent",
          label: "I consent to Youth Policy Lab storing this message in order to respond to it.",
          type: "consent",
          required: true,
        },
      ],
    },
  ],
};

export const formDefs = { team: teamForm, board: boardForm, advisor: advisorForm, contact: contactForm };

export type FormValues = Record<string, string | string[] | boolean>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isVisible(field: Field, values: FormValues) {
  if (!field.showIf) return true;
  const v = values[field.showIf.field];
  return typeof v === "string" && field.showIf.values.includes(v);
}

export function validateField(field: Field, values: FormValues): string | null {
  if (!isVisible(field, values)) return null;
  const raw = values[field.name];
  if (field.type === "consent") {
    return field.required && raw !== true ? "Please confirm to continue." : null;
  }
  if (field.type === "checkboxes") {
    const arr = Array.isArray(raw) ? raw : [];
    if (field.required && arr.length === 0) return "Please choose at least one option.";
    if (field.maxSelect && arr.length > field.maxSelect) return `Please choose no more than ${field.maxSelect}.`;
    if (field.options && arr.some((a) => !field.options!.includes(a))) return "Please choose from the listed options.";
    return null;
  }
  const v = typeof raw === "string" ? raw.trim() : "";
  if (!v) return field.required ? "This field is required." : null;
  if (field.maxLength && v.length > field.maxLength) return `Please keep this under ${field.maxLength} characters.`;
  if (field.minLength && v.length < field.minLength) return `Please write at least ${field.minLength} characters (currently ${v.length}).`;
  if (field.type === "email" && !EMAIL_RE.test(v)) return "Please enter a valid email address.";
  if (field.type === "url") {
    try {
      const u = new URL(v);
      if (!/^https?:$/.test(u.protocol)) throw new Error();
    } catch {
      return "Please enter a full link starting with https://";
    }
  }
  if ((field.type === "select" || field.type === "radio") && field.options && !field.options.includes(v)) {
    return "Please choose from the listed options.";
  }
  return null;
}

export function validateForm(def: FormDef, values: FormValues) {
  const errors: Record<string, string> = {};
  for (const s of def.sections) {
    for (const f of s.fields) {
      const e = validateField(f, values);
      if (e) errors[f.name] = e;
    }
  }
  return errors;
}

/** Strip unknown keys and normalise values to the definition. */
export function cleanValues(def: FormDef, values: FormValues): FormValues {
  const out: FormValues = {};
  for (const s of def.sections) {
    for (const f of s.fields) {
      if (!isVisible(f, values)) continue;
      const v = values[f.name];
      if (f.type === "consent") out[f.name] = v === true;
      else if (f.type === "checkboxes") out[f.name] = Array.isArray(v) ? v.map(String).slice(0, 20) : [];
      else if (typeof v === "string" && v.trim()) out[f.name] = v.trim().slice(0, f.maxLength ?? 5000);
    }
  }
  return out;
}

export function fieldLabel(defId: keyof typeof formDefs, name: string) {
  for (const s of formDefs[defId].sections) for (const f of s.fields) if (f.name === name) return f.label;
  return name;
}
