import type { Settings } from "../schemas";
import settings from "./settings.json";

// Snapshot of GET /api/v1/site/settings. Store and social URLs are null: the site hides them.
export const settingsFixture = settings as unknown as Settings;
