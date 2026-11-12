export type CmsErrorKind = "network" | "http" | "parse";

/** Every failure from lib/cms: network down, non-2xx, or a payload that breaks its schema. */
export class CmsError extends Error {
  constructor(
    public readonly kind: CmsErrorKind,
    message: string,
    public readonly status?: number,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "CmsError";
  }

  get notFound() {
    return this.kind === "http" && this.status === 404;
  }
}
