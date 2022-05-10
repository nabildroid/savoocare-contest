export type Entity<T> = Omit<T, "id">;

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
