export function createSlug(username: string): string {
  return username
    .normalize("NFD") // Normalize to decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove special characters
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with hyphens
    .replace(/-+/g, "-") // Reduce multiple hyphens to a single hyphen
    .toLowerCase()
    .trim();
}
