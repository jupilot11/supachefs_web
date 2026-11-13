import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: async () =>
    new Headers({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }),
}));

import { submitChefLead } from "./action";
import { z } from "zod";
import {
  chefLeadSchema,
  MESSAGES,
  parseChefLead,
  type ChefLeadState,
} from "./schema";

const valid = {
  full_name: "Nena Cabahug",
  mobile: "09171234567",
  email: "",
  area: "Talamban",
  cooks: "Humba, pochero",
  days: ["mon", "wed"],
  heard_from: "Facebook",
  turnstile_token: "tok",
};

describe("chefLeadSchema mobile", () => {
  const parse = (mobile: string) =>
    chefLeadSchema.safeParse({ ...valid, mobile });
  it.each(["09171234567", "+639171234567", "917 123 4567", "0917-123-4567"])(
    "accepts %s",
    (m) => expect(parse(m).success).toBe(true),
  );
  it("normalises the bare 10-digit form to 09…", () => {
    expect(parse("917 123 4567").data?.mobile).toBe("09171234567");
  });
  it.each([
    "",
    "12345",
    "08171234567",
    "+638171234567",
    "0917123456",
    "091712345678",
    "abc",
  ])("rejects %j", (m) => expect(parse(m).success).toBe(false));
});

function form(
  over: Partial<Record<keyof typeof valid, string | string[]>> = {},
) {
  const v = { ...valid, ...over };
  const fd = new FormData();
  fd.set("full_name", v.full_name as string);
  fd.set("mobile", v.mobile as string);
  fd.set("email", v.email as string);
  fd.set("area", v.area as string);
  fd.set("cooks", v.cooks as string);
  for (const d of v.days as string[]) fd.append("days", d);
  fd.set("heard_from", v.heard_from as string);
  fd.set("cf-turnstile-response", v.turnstile_token as string);
  return fd;
}

describe("parseChefLead (shared by the browser and the action)", () => {
  it("reads a complete form", () => {
    expect(parseChefLead(form()).success).toBe(true);
  });
  it("reports each bad field once, in form order", () => {
    const r = parseChefLead(form({ full_name: " ", days: [] }));
    if (r.success) throw new Error("expected a failure");
    expect(Object.keys(z.flattenError(r.error).fieldErrors)).toEqual([
      "full_name",
      "days",
    ]);
  });
});

const idle: ChefLeadState = { status: "idle" };
const respond = (status: number, body: unknown = {}) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status }));

describe("submitChefLead", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("201 -> success, with secret and leftmost client IP", async () => {
    const f = respond(201, { id: 12 });
    vi.stubGlobal("fetch", f);
    expect(await submitChefLead(idle, form())).toEqual({ status: "success" });
    const [url, init] = f.mock.calls[0] as unknown as [URL, RequestInit];
    expect(String(url)).toBe("http://api.test/api/v1/site/chef-leads");
    const h = init.headers as Record<string, string>;
    expect(h["X-Site-Secret"]).toBe("test-server-secret");
    expect(h["X-Client-IP"]).toBe("203.0.113.9");
    expect(JSON.parse(init.body as string)).toMatchObject({
      mobile: "09171234567",
      turnstile_token: "tok",
    });
  });

  it("422 -> Laravel errors mapped onto fields", async () => {
    vi.stubGlobal(
      "fetch",
      respond(422, {
        message: "Invalid",
        errors: { mobile: ["Taken."], turnstile_token: ["Bad."] },
      }),
    );
    expect(await submitChefLead(idle, form())).toEqual({
      status: "error",
      message: "Invalid",
      fieldErrors: { mobile: ["Taken."], turnstile_token: ["Bad."] },
    });
  });

  it("429 -> rate-limit message", async () => {
    vi.stubGlobal("fetch", respond(429));
    expect(await submitChefLead(idle, form())).toMatchObject({
      status: "error",
      message: "Too many tries. Wait a minute and send again.",
    });
  });

  it.each([500, 503])("%i -> network message", async (code) => {
    vi.stubGlobal("fetch", respond(code));
    expect(await submitChefLead(idle, form())).toMatchObject({
      status: "error",
      message: MESSAGES.network,
    });
  });

  it("network failure -> network message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("down");
      }),
    );
    expect(await submitChefLead(idle, form())).toMatchObject({
      status: "error",
      message: "We couldn't send that. Check your connection and try again.",
    });
  });

  it("invalid input returns field errors without calling the API", async () => {
    const f = respond(201);
    vi.stubGlobal("fetch", f);
    const res = await submitChefLead(
      idle,
      form({ full_name: "", mobile: "1", days: [], turnstile_token: "" }),
    );
    expect(res.status).toBe("error");
    if (res.status === "error") {
      expect(Object.keys(res.fieldErrors ?? {})).toEqual(
        expect.arrayContaining([
          "full_name",
          "mobile",
          "days",
          "turnstile_token",
        ]),
      );
    }
    expect(f).not.toHaveBeenCalled();
  });

  it("rejects an area that is not in the settings list", async () => {
    const f = respond(201);
    vi.stubGlobal("fetch", f);
    const res = await submitChefLead(idle, form({ area: "Narnia" }));
    expect(res).toMatchObject({
      status: "error",
      fieldErrors: { area: expect.any(Array) },
    });
    expect(f).not.toHaveBeenCalled();
  });
});
