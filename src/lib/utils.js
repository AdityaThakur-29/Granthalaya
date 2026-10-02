export { cn } from "cn";

export function formatDate(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

export function isOverdue(dueDateString) {
  if (!dueDateString) return false;
  return new Date(dueDateString).getTime() < Date.now();
}

export function getDaysRemaining(dueDateString) {
  if (!dueDateString) return 0;
  const diffTime = new Date(dueDateString).getTime() - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getInitials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}
