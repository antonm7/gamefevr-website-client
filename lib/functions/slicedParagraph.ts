export default function slicedParagrap(
  text: string,
  maxLength: number,
  slice: number
): string {
  if (text.length > maxLength) {
    return text.slice(0, slice) + '...'
  }
  return text
}
