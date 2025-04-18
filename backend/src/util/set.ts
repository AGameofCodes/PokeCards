export function setEqual<T>(a: Set<T>, b: Set<T>) {
  return a.size === b.size && [...a].every(value => b.has(value));
}
