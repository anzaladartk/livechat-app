export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
