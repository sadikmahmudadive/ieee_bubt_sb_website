type DateValue = string | number | Date | { toDate: () => Date } | null | undefined;

const isValidDate = (value: Date): boolean => !Number.isNaN(value.getTime());

export function toDateValue(value: DateValue): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return isValidDate(value) ? value : null;
  }

  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    const converted = value.toDate();
    return isValidDate(converted) ? converted : null;
  }

  const parsed = new Date(value);
  return isValidDate(parsed) ? parsed : null;
}

export function formatEventDateRange(start: DateValue, end?: DateValue): string {
  const startDate = toDateValue(start);
  if (!startDate) {
    return "TBD";
  }

  const endDate = toDateValue(end);
  if (!endDate || endDate.getTime() === startDate.getTime()) {
    return startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  }

  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const sameMonth = sameYear && startDate.getMonth() === endDate.getMonth();

  if (sameYear && sameMonth) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })} - ${endDate.toLocaleDateString("en-US", {
      day: "numeric",
      year: "numeric"
    })}`;
  }

  if (sameYear) {
    return `${startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    })} - ${endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })}`;
  }

  return `${startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })} - ${endDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  })}`;
}

export function toDateInputValue(value: DateValue): string {
  const date = toDateValue(value);
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}
