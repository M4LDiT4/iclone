export const usDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",   // "Aug"
  day: "numeric",   // "10"
  year: "numeric",  // "2025"
});

export function formatUSDate(date: Date | null): string {
  if (!date) return ""; // or "Invalid date"
  return usDateFormatter.format(date);
}

export function capitalizeWords(input: string): string {
  if (!input) return "";
  return input
    .toLowerCase() // normalize casing
    .split(" ")    // split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
