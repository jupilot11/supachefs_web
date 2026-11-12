"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitChefLead } from "./action";
import { DAYS, type ChefLeadState } from "./schema";
import { Turnstile } from "./turnstile";

const idle: ChefLeadState = { status: "idle" };

type Draft = Record<string, string | string[]>;
const snapshot = (fd: FormData): Draft => ({
  full_name: String(fd.get("full_name") ?? ""),
  mobile: String(fd.get("mobile") ?? ""),
  email: String(fd.get("email") ?? ""),
  area: String(fd.get("area") ?? ""),
  cooks: String(fd.get("cooks") ?? ""),
  days: fd.getAll("days").map(String),
  heard_from: String(fd.get("heard_from") ?? ""),
});

const fieldClass =
  "h-12 rounded-[10px] border-sand bg-white px-3.5 text-base md:text-base";

const selectClass = cn(
  fieldClass,
  "w-full appearance-none border pr-10 outline-none focus-visible:border-brand focus-visible:ring-3 focus-visible:ring-orange-tint aria-invalid:border-error",
);

function SelectWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-secondary"
      />
    </div>
  );
}

export function ChefLeadForm({
  areas,
  heardFrom,
  siteKey,
}: {
  areas: string[];
  heardFrom: string[];
  siteKey: string;
}) {
  const [state, formAction, pending] = useActionState(submitChefLead, idle);
  // React resets the form after an action; the draft puts every answer back.
  const [draft, setDraft] = useState<Draft>({});
  const [resets, setResets] = useState(0);
  const form = useRef<HTMLFormElement>(null);
  const alert = useRef<HTMLDivElement>(null);
  const confirmation = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState<ChefLeadState>(idle);

  // On each new response: reset the single-use Turnstile token (unless success) and move focus.
  if (state !== seen) {
    setSeen(state);
    if (state.status === "error") setResets((n) => n + 1);
  }
  useEffect(() => {
    if (state.status === "success") confirmation.current?.focus();
    if (state.status === "error") {
      const first = form.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      (first ?? alert.current)?.focus();
    }
  }, [state]);

  if (state.status === "success") {
    return (
      <div
        ref={confirmation}
        tabIndex={-1}
        role="status"
        className="flex flex-col gap-2 rounded-2xl border border-sand-light bg-orange-wash p-6 outline-none lg:p-10"
      >
        <h3 className="text-2xl font-extrabold text-primary">
          Salamat! We got it.
        </h3>
        <p className="text-secondary">
          We&apos;ll text you within 3 days to set up a short call. No need to
          prepare anything.
        </p>
      </div>
    );
  }

  const errs = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const err = (name: string) => errs[name]?.[0];
  const a11y = (name: string, hint?: string) => ({
    "aria-invalid": err(name) ? (true as const) : undefined,
    "aria-describedby":
      [err(name) && `${name}-error`, hint].filter(Boolean).join(" ") ||
      undefined,
  });
  const checkedDays = (draft.days as string[] | undefined) ?? [];
  const text = (name: string) => (draft[name] as string | undefined) ?? "";

  const fieldError = (name: string) =>
    err(name) ? (
      <p id={`${name}-error`} className="text-[13px] font-medium text-error">
        {err(name)}
      </p>
    ) : null;

  return (
    <form
      ref={form}
      noValidate
      action={(fd) => {
        setDraft(snapshot(fd));
        formAction(fd);
      }}
      className="flex flex-col gap-5 rounded-2xl border border-sand-light bg-white p-5 shadow-xs lg:p-8"
    >
      {state.status === "error" && (
        <div
          ref={alert}
          tabIndex={-1}
          role="alert"
          className="rounded-[10px] bg-error-tint p-3.5 text-sm font-semibold text-error outline-none"
        >
          {state.message}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="full_name" className="text-sm font-semibold">
          Full name
        </Label>
        <Input
          id="full_name"
          name="full_name"
          autoComplete="name"
          placeholder="e.g. Nena Dela Cruz"
          defaultValue={text("full_name")}
          className={fieldClass}
          {...a11y("full_name", "full_name-hint")}
        />
        <p id="full_name-hint" className="text-[13px] text-secondary">
          Customers only ever see your first name.
        </p>
        {fieldError("full_name")}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="mobile" className="text-sm font-semibold">
          Mobile number
        </Label>
        <div className="flex">
          <span
            aria-hidden="true"
            className="grid h-12 place-items-center rounded-l-[10px] border border-r-0 border-sand bg-subtle px-3.5 text-base font-semibold text-secondary"
          >
            +63
          </span>
          <Input
            id="mobile"
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="917 123 4567"
            defaultValue={text("mobile")}
            className={cn(fieldClass, "rounded-l-none")}
            {...a11y("mobile")}
          />
        </div>
        {fieldError("mobile")}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email" className="text-sm font-semibold">
          Email <span className="font-normal text-secondary">(optional)</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          defaultValue={text("email")}
          className={fieldClass}
          {...a11y("email")}
        />
        {fieldError("email")}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="area" className="text-sm font-semibold">
          Barangay or area
        </Label>
        <SelectWrap>
          <select
            key={text("area")}
            id="area"
            name="area"
            defaultValue={text("area")}
            className={selectClass}
            {...a11y("area")}
          >
            <option value="">Choose your area</option>
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </SelectWrap>
        {fieldError("area")}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="cooks" className="text-sm font-semibold">
          What do you cook?
        </Label>
        <Textarea
          id="cooks"
          name="cooks"
          rows={3}
          placeholder="e.g. Humba, pochero, and my lola's leche flan"
          defaultValue={text("cooks")}
          className="min-h-24 rounded-[10px] border-sand bg-white px-3.5 py-3 text-base md:text-base"
          {...a11y("cooks")}
        />
        {fieldError("cooks")}
      </div>

      <fieldset
        className="flex flex-col gap-2"
        aria-describedby={["days-hint", err("days") && "days-error"]
          .filter(Boolean)
          .join(" ")}
      >
        <legend className="mb-1.5 text-sm font-semibold">
          When could you cook?
        </legend>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <label
              key={`${d.value}-${checkedDays.includes(d.value)}`}
              className="cursor-pointer"
            >
              <input
                type="checkbox"
                name="days"
                value={d.value}
                defaultChecked={checkedDays.includes(d.value)}
                aria-invalid={err("days") ? true : undefined}
                className="peer sr-only"
              />
              <span className="inline-flex h-11 min-w-14 items-center justify-center rounded-full border-[1.5px] border-sand bg-white px-4 text-sm font-semibold text-primary transition-transform duration-150 select-none peer-checked:border-orange-dark peer-checked:bg-orange-dark peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand active:translate-y-px">
                {d.label}
              </span>
            </label>
          ))}
        </div>
        <p id="days-hint" className="text-[13px] text-secondary">
          Rough is fine. You can change this anytime.
        </p>
        {fieldError("days")}
      </fieldset>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="heard_from" className="text-sm font-semibold">
          How did you hear about us?
        </Label>
        <SelectWrap>
          <select
            key={text("heard_from")}
            id="heard_from"
            name="heard_from"
            defaultValue={text("heard_from")}
            className={selectClass}
            {...a11y("heard_from")}
          >
            <option value="">Choose one</option>
            {heardFrom.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </SelectWrap>
        {fieldError("heard_from")}
      </div>

      <div className="flex flex-col gap-1.5">
        <Turnstile siteKey={siteKey} resetKey={resets} />
        {fieldError("turnstile_token")}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        aria-busy={pending}
        className="w-full"
      >
        {pending && (
          <Loader2 className="size-5 animate-spin" aria-hidden="true" />
        )}
        {pending ? "Sending…" : "Send my application"}
      </Button>
      <p className="text-center text-[13px] text-secondary">
        We&apos;ll text you within 3 days. Applying doesn&apos;t commit you to
        anything.
      </p>
    </form>
  );
}
