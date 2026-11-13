import { z } from "zod";

export const DAYS = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
] as const;

const dayValues = DAYS.map((d) => d.value) as [string, ...string[]];

/** Tolerate "917 123 4567" (the +63 prefix is shown beside the field) and "0917-123-4567". */
export function normalizeMobile(raw: unknown): unknown {
  if (typeof raw !== "string") return raw;
  const s = raw.replace(/[\s\-().]/g, "");
  return /^9\d{9}$/.test(s) ? `0${s}` : s;
}

// CONTRACT.md "Rules": PH mobile 09XXXXXXXXX or +639XXXXXXXXX.
export const PH_MOBILE = /^(?:09\d{9}|\+639\d{9})$/;

export const chefLeadSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(120, "Keep it under 120 characters."),
  mobile: z.preprocess(
    normalizeMobile,
    z
      .string()
      .min(1, "Enter your mobile number.")
      .regex(PH_MOBILE, "Enter a Philippine mobile number, like 917 123 4567."),
  ),
  email: z
    .union([z.literal(""), z.email("Enter a valid email, or leave it blank.")])
    .optional(),
  area: z.string().min(1, "Choose your area."),
  cooks: z
    .string()
    .trim()
    .min(1, "Tell us what you cook.")
    .max(500, "Keep it under 500 characters."),
  days: z
    .array(z.enum(dayValues))
    .min(1, "Pick at least one day.")
    .refine((d) => new Set(d).size === d.length, "Pick each day once."),
  heard_from: z.string().min(1, "Choose one."),
  turnstile_token: z.string().min(1, "Complete the security check."),
});

/** One parse for the browser (before submit) and the server action, so the two cannot drift. */
export const parseChefLead = (fd: FormData) =>
  chefLeadSchema.safeParse({
    full_name: fd.get("full_name") ?? "",
    mobile: fd.get("mobile") ?? "",
    email: fd.get("email") ?? "",
    area: fd.get("area") ?? "",
    cooks: fd.get("cooks") ?? "",
    days: fd.getAll("days"),
    heard_from: fd.get("heard_from") ?? "",
    turnstile_token: fd.get("cf-turnstile-response") ?? "",
  });

export type ChefLead = z.output<typeof chefLeadSchema>;

export type FieldErrors = Partial<Record<string, string[]>>;

export type ChefLeadState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors };

export const MESSAGES = {
  rateLimited: "Too many tries. Wait a minute and send again.",
  network: "We couldn't send that. Check your connection and try again.",
  invalid: "Check the highlighted fields and send again.",
} as const;
