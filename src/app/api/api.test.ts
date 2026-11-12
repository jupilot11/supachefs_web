import { createHmac } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { enable, disable, revalidateTag, Redirect } = vi.hoisted(() => ({
  enable: vi.fn(),
  disable: vi.fn(),
  revalidateTag: vi.fn(),
  Redirect: class extends Error {
    constructor(public to: string) {
      super(`redirect:${to}`);
    }
  },
}));

vi.mock("next/headers", () => ({
  draftMode: async () => ({ enable, disable, isEnabled: false }),
}));
vi.mock("next/navigation", () => ({
  redirect: (to: string) => {
    throw new Redirect(to);
  },
}));
vi.mock("next/cache", () => ({ revalidateTag }));

import { GET as draft } from "./draft/route";
import { POST as revalidate } from "./revalidate/route";

const sign = (slug: string, exp: number, key = "test-preview-token") =>
  createHmac("sha256", key).update(`${slug}|${exp}`).digest("hex");
const draftUrl = (q: Record<string, string | number | undefined>) => {
  const u = new URL("http://localhost:3000/api/draft");
  for (const [k, v] of Object.entries(q))
    if (v !== undefined) u.searchParams.set(k, String(v));
  return new Request(u);
};
const future = () => Math.floor(Date.now() / 1000) + 600;

describe("/api/draft", () => {
  beforeEach(() => vi.clearAllMocks());

  it("401 when sig is missing (a bare link never shows drafts)", async () => {
    const res = await draft(draftUrl({ slug: "home", exp: future() }));
    expect(res.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("401 for a wrong sig", async () => {
    const exp = future();
    const res = await draft(
      draftUrl({ slug: "home", exp, sig: sign("home", exp, "other-key") }),
    );
    expect(res.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("401 for a sig that signs a different slug", async () => {
    const exp = future();
    const res = await draft(
      draftUrl({ slug: "about", exp, sig: sign("home", exp) }),
    );
    expect(res.status).toBe(401);
  });

  it("401 for an expired link, even with a valid sig", async () => {
    const exp = Math.floor(Date.now() / 1000) - 1;
    const res = await draft(
      draftUrl({ slug: "home", exp, sig: sign("home", exp) }),
    );
    expect(res.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
  });

  it("401 for an unknown slug", async () => {
    const exp = future();
    const res = await draft(
      draftUrl({ slug: "secret", exp, sig: sign("secret", exp) }),
    );
    expect(res.status).toBe(401);
  });

  it("enables draft mode and redirects for a valid link", async () => {
    const exp = future();
    const err = await draft(
      draftUrl({
        slug: "how-it-works-chefs",
        exp,
        sig: sign("how-it-works-chefs", exp),
      }),
    ).catch((e) => e);
    expect(err).toBeInstanceOf(Redirect);
    expect(err.to).toBe("/how-it-works/chefs");
    expect(enable).toHaveBeenCalledOnce();
  });

  it("exit=1 disables draft mode", async () => {
    const err = await draft(draftUrl({ exit: 1 })).catch((e) => e);
    expect(err.to).toBe("/");
    expect(disable).toHaveBeenCalledOnce();
  });
});

describe("/api/revalidate", () => {
  beforeEach(() => vi.clearAllMocks());
  const post = (secret: string | null, body: unknown) =>
    revalidate(
      new Request("http://localhost:3000/api/revalidate", {
        method: "POST",
        headers: secret === null ? {} : { "x-revalidate-secret": secret },
        body: typeof body === "string" ? body : JSON.stringify(body),
      }),
    );

  it("401 on a bad or missing secret", async () => {
    expect((await post("nope", { tags: ["faqs"] })).status).toBe(401);
    expect((await post(null, { tags: ["faqs"] })).status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("400 on a bad body", async () => {
    expect((await post("test-revalidate-secret", "{not json")).status).toBe(
      400,
    );
    expect((await post("test-revalidate-secret", { tags: [] })).status).toBe(
      400,
    );
    expect(
      (await post("test-revalidate-secret", { tags: ["../etc"] })).status,
    ).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("revalidates each tag with the right secret", async () => {
    const res = await post("test-revalidate-secret", {
      tags: ["page:home", "faqs"],
    });
    expect(res.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledTimes(2);
    expect(revalidateTag).toHaveBeenCalledWith("page:home", { expire: 0 });
    expect(revalidateTag).toHaveBeenCalledWith("faqs", { expire: 0 });
  });
});
