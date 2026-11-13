const MARK = /\[Placeholder/i;
const NOTE = /\s*\[Placeholder[^\]]*\]/gi;

// An array entry (card, FAQ, step, chip) is unpublishable when one of its own text fields has a note.
const hasNote = (item: unknown): boolean =>
  typeof item === "string"
    ? MARK.test(item)
    : item !== null &&
      typeof item === "object" &&
      !Array.isArray(item) &&
      Object.values(item).some((v) => typeof v === "string" && MARK.test(v));

/**
 * Admin drafts carry "[Placeholder: ...]" to-do notes. A visitor must never read one: an array entry
 * with a note is dropped whole, and loose text (a paragraph, a body) just loses the note.
 * shortcut: a group whose entries are all dropped stays as an empty heading; upgrade if the CMS ever ships that.
 */
export function dropPlaceholders<T>(value: T): T {
  if (typeof value === "string") return value.replace(NOTE, "").trim() as T;
  if (Array.isArray(value))
    return value.filter((i) => !hasNote(i)).map(dropPlaceholders) as T;
  if (value !== null && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, dropPlaceholders(v)]),
    ) as T;
  return value;
}
