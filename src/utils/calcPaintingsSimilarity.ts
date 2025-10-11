import { CANVAS_PIXELS_LENGHT } from '@consts'
import { canvasParser } from './canvasParser'
import { colorComparison } from './colorComparison'

export const calcPaintingsSimilarity = (originalPixels: string[], comparingPixels: string[]) => {
  const COLOR_MISMATCH_PENALTY = 0.33

  const applyColorMismatchPenalty = (rawScore: number, mismatch: boolean) =>
    mismatch ? rawScore * COLOR_MISMATCH_PENALTY : rawScore

  // Extract color regions
  const originalRegions = extractColorRegions(originalPixels)
  const comparingRegions = extractColorRegions(comparingPixels)

  let totalScore = 0
  console.log({ originalRegions })

  // Check the corresponding pixels for each region
  for (const [regionColor, regionIndexes] of originalRegions) {
    const colorAppereancesMap: Record<string, number> = {}
    const dominantColor = { color: '', appereances: 0 }

    // Get the dominant color
    for (const index of regionIndexes) {
      const color = comparingPixels[index]

      const newAppereancesValue = (colorAppereancesMap[color] ?? 0) + 1
      colorAppereancesMap[color] = newAppereancesValue

      if (newAppereancesValue > dominantColor.appereances) {
        dominantColor.color = color
        dominantColor.appereances = newAppereancesValue
      }
    }

    // Calculate score and percentage
    const rawScore = dominantColor.appereances / regionIndexes.length
    const colorMatches = colorComparison(dominantColor.color, regionColor)
    const regionPercentage = regionIndexes.length / CANVAS_PIXELS_LENGHT
    const regionScore = applyColorMismatchPenalty(rawScore, !colorMatches)

    totalScore += regionScore * regionPercentage

    /*
      TODO: fine tune logic

      If a region has the same dominat color as another one already had, take away both their validity
      This has to be done progressively, causing a single color canvas to score 0
    */

    // Report (DELETE)
    console.log({
      originalRegion: {
        color: regionColor,
        count: regionIndexes.length
      },
      dominantColor,
      regionPercentage,
      score: {
        raw: rawScore,
        afterPenalty: regionScore,
        colorMismatchPenalty: COLOR_MISMATCH_PENALTY,
        colorMatches: colorMatches
      }
    })
  }

  return totalScore
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
