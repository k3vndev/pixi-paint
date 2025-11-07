import { useEffect, useRef } from 'react'
import { CANVAS_PIXELS_LENGHT, COLOR_PALETTE } from '@/consts'
import { usePlayContext } from '@/context/PlayContext'
import minigamePaintings from '@/lib/minigame-paintings.json'
import { usePaintStore } from '@/store/usePaintStore'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { canvasParser } from '@/utils/canvasParser'
import { getRandomItem } from '@/utils/getRandomItem'
import { useBucketPixels } from './useBucketPixels'
import { useEvent } from './useEvent'
import { useFreshRefs } from './useFreshRefs'

interface Params {
  mainSequence: () => Promise<void>
}

export const usePlayMinigame = ({ mainSequence }: Params) => {
  const { paintBucketPixels } = useBucketPixels()
  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)
  const setEditingPixels = usePaintStore(s => s.setPixels)
  const editingPixels = usePaintStore(s => s.pixels)

  const refs = useFreshRefs({ editingPixels })
  const isShowingResults = useRef(false)

  const SEMI_TRANSPARENT_PIXELS = Array(CANVAS_PIXELS_LENGHT).fill('#ffffffc8')

  const { setIsRenderingGame } = usePlayContext()

  const animateSetPixels = (pixels: string[]) =>
    paintBucketPixels({
      startIndexes: calcMiddlePixelsIndexes(),
      paintGenerationAction: generation => {
        const { editingPixels } = refs.current
        const editingPixelsClone = structuredClone(editingPixels)

        for (const { index } of generation) {
          editingPixelsClone[index] = pixels[index]
        }
        setEditingPixels(editingPixelsClone)
      }
    })

  const pickRandomMinigamePainting = () => {
    const randomPainting = getRandomItem(minigamePaintings)
    const parsed = canvasParser.fromStorage(randomPainting as any)

    if (!parsed) throw new Error()
    return parsed.pixels
  }

  useEffect(() => {
    setPrimaryColor(COLOR_PALETTE.RED)
    setSecondaryColor(COLOR_PALETTE.WHITE)

    ;(async () => {
      await mainSequence()
      isShowingResults.current = true
    })()
  }, [])

  const restartMinigame = () => {
    isShowingResults.current = false
    mainSequence()
  }

  const exitMinigame = () => {
    setIsRenderingGame(false)
  }

  useEvent('$dialog-menu-closed', () => {
    if (isShowingResults.current) {
      isShowingResults.current = false

      exitMinigame()
    }
  })

  return {
    pickRandomMinigamePainting,
    animateSetPixels,
    SEMI_TRANSPARENT_PIXELS,
    restartMinigame,
    exitMinigame
  }
}
