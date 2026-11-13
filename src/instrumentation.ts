// Fail at boot, not on the first request, when the environment is incomplete.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { env } = await import("./lib/env");
  env();
}
