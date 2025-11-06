import { CANVAS_PIXELS_LENGHT } from '@consts'
import { canvasParser } from './canvasParser'
import { colorComparison } from './colorComparison'
import { colorSimilarity } from './colorSimilarity'

export const calcPaintingsSimilarity = (originalPixels: string[], comparingPixels: string[]) => {
  const COLOR_MISMATCH_PENALTY = 0.33

  // Extract color regions
  const originalRegions = extractColorRegions(originalPixels)
  const regionsScore: RegionScore[] = []

  // Check the corresponding pixels for each region
  for (const [originalRegionColor, originalRegionIndexes] of originalRegions) {
    const comparingRegionPixels = originalRegionIndexes.map(i => comparingPixels[i])
    const comparingRegions = extractColorRegions(comparingRegionPixels)

    let regionTotalScore = 0
    const dominantColor = {
      color: '',
      count: 0
    }

    for (const [comparingRegionColor, comparingRegionIndexes] of comparingRegions) {
      // This represents a painted zone in an orignal region
      // In a perfect match, originalRegionIndexes and comparingRegionIndexes should be equal

      const similarity = colorSimilarity(originalRegionColor, comparingRegionColor)
      const colorScore = similarity === 1 ? similarity : similarity * COLOR_MISMATCH_PENALTY

      // Weight the score by the size of the painted region.
      regionTotalScore += (colorScore * comparingRegionIndexes.length ** 2) / originalRegionIndexes.length

      // Track dominant color
      if (comparingRegionIndexes.length > dominantColor.count) {
        dominantColor.color = comparingRegionColor
        dominantColor.count = comparingRegionIndexes.length
      }
    }

    regionsScore.push({
      score: regionTotalScore,
      dominantColor: dominantColor.color,
      size: originalRegionIndexes.length
    })
  }

  // Calculate final score
  let totalScore = 0
  const seenDominantColors = new Set<string>()

  for (const { score, dominantColor } of regionsScore) {
    // Penalize regions where the dominant color was repeated
    if (seenDominantColors.has(dominantColor)) {
      continue
    }

    seenDominantColors.add(dominantColor)
    totalScore += score
  }

  return totalScore / CANVAS_PIXELS_LENGHT
}

const extractColorRegions = (pixels: string[]) => {
  const parsedCanvas = canvasParser.toStorage(pixels)
  if (!parsedCanvas) throw new Error('extractColorRegions: Could not parse canvas')

  const { pixels: baseRegions, bg } = parsedCanvas
  const bgPositions = pixels
    .map((color, index) => (colorComparison(color, bg) ? index : -1))
    .filter(position => position !== -1)

  return Object.entries({
    ...baseRegions,
    [bg]: bgPositions
  })
}

interface RegionScore {
  score: number
  dominantColor: string
  size: number
}
