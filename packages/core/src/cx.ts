export function isNotEmpty<T>(value: T | false | null | undefined): value is T {
  return !!value
}

export function cx(
  ...opts: (string | undefined | null | false | { [key: string]: boolean })[]
): string {
  return opts
    .filter(isNotEmpty)
    .map((item) =>
      typeof item === 'string'
        ? item
        : Object.keys(item)
            .filter((key) => item[key])
            .join(' '),
    )
    .join(' ')
}
