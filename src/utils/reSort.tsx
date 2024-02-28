export function reSort<T, K extends keyof T, V extends T[K]>(
  data: Array<T>,
  key: K,
  template: Array<V>
): Array<T> {
  return data.sort((a, b) => {
    const _a = template.findIndex((value) => value === a[key]);
    const _b = template.findIndex((value) => value === b[key]);
    return _a - _b;
  });
}
