export const colorSimilarity = (hex1: string, hex2: string) => {
  // Convert HEX to RGB
  const toRGB = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }

  const [r1, g1, b1] = toRGB(hex1)
  const [r2, g2, b2] = toRGB(hex2)

  // Euclidean distance between colors
  const distance = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)

  // Max distance in RGB space (black vs white)
  const maxDistance = Math.sqrt(3 * 255 ** 2)

  // Convert to similarity between 0 and 1
  return 1 - distance / maxDistance
}
