import type { Settings } from "./schemas";

/** True when at least one store link is set. With none, there is nothing to download from, so nothing is shown. */
export const hasStore = (store: Settings["store"]) =>
  Boolean(store.app_store_url || store.play_store_url);
