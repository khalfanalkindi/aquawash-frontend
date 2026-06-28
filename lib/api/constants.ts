export const isApiMode = () => process.env.NEXT_PUBLIC_USE_API === 'true'

export function toId(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return ''
  return String(value)
}

export function toNumId(value: string | number): number {
  return typeof value === 'number' ? value : parseInt(value, 10)
}
