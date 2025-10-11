import { BLANK_PIXELS, CANVAS_PIXELS_LENGHT, COLOR_PALETTE } from '@consts'
import { useEffect, useState } from 'react'
import { useBucketPixels } from '@/hooks/useBucketPixels'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { usePaintStore } from '@/store/usePaintStore'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { calcPaintingsSimilarity } from '@/utils/calcPaintingsSimilarity'
import { waitForSeconds } from '@/utils/waitForSeconds'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZone } from '../dialog-menu/DMZone'
import { PaintWorkspace } from '../paint-workspace/PaintWorkspace'
import { TitleDisplay, useTitleDisplay } from './TitleDisplay'

export const PaintMinigame = () => {
  const [isShowingCanvas, setIsShowingCanvas] = useState(false)
  const [canvasIsDisabled, setCanvasIsDisabled] = useState(true)

  const editingPixels = usePaintStore(s => s.pixels)
  const setEditingPixels = usePaintStore(s => s.setPixels)

  const [timer, setTimer] = useState(-1)

  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

  const refs = useFreshRefs({ editingPixels })

  const { displayTitle, hideTitle, titleState } = useTitleDisplay()
  const { paintBucketPixels } = useBucketPixels()
  const { openMenu } = useDialogMenu()

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

  useEffect(() => {
    setPrimaryColor(COLOR_PALETTE.RED)
    setSecondaryColor(COLOR_PALETTE.WHITE)

    mainSequence()
  }, [])

  const runTimer = (seconds: number) => {
    setTimer(seconds)
    let currentTime = seconds

    requestAnimationFrame(() => {
      const interval = setInterval(() => {
        if (currentTime <= 0) {
          clearInterval(interval)
          setTimer(-1)
          return
        }

        currentTime -= 0.1
        setTimer(currentTime)
      }, 100)
    })
  }

  const mainSequence = async () => {
    await waitForSeconds(0.1)

    setEditingPixels(SEMI_TRANSPARENT_PIXELS)
    setIsShowingCanvas(true)

    await waitForSeconds(0.4)

    displayTitle('MEMORIZE', 'THIS PAINTING...')
    await waitForSeconds(2)
    hideTitle()

    await waitForSeconds(0.1)

    animateSetPixels(MOCK_PIXELS)

    runTimer(3)
    await waitForSeconds(3)

    // Run timer here

    animateSetPixels(BLANK_PIXELS)

    setCanvasIsDisabled(false)

    runTimer(45)
    await waitForSeconds(45)

    setCanvasIsDisabled(true)

    // Wait for the user to view
    runTimer(1.5)
    await waitForSeconds(1.5)

    // Calculate results here
    const score = calcPaintingsSimilarity(MOCK_PIXELS, refs.current.editingPixels)
    openMenu(
      <>
        <DMHeader icon='gamepad'>Your results</DMHeader>
        <DMParagraph>You got a score of {(score * 100).toFixed(0)}%</DMParagraph>

        <DMZone className='flex gap-4'>
          <DMCanvasImage pixels={refs.current.editingPixels} />
          <DMCanvasImage pixels={MOCK_PIXELS} />
        </DMZone>
      </>
    )
  }

  return (
    <>
      {isShowingCanvas && <PaintWorkspace disabled={canvasIsDisabled} hideColorbarSelector />}

      <TitleDisplay {...titleState} />

      {/* Temporary timer*/}
      {timer > 0 && (
        <span className='fixed right-8 bottom-8 text-xl text-theme-10 font-mono'>{timer.toFixed(2)}</span>
      )}
    </>
  )
}

const SEMI_TRANSPARENT_PIXELS = Array(CANVAS_PIXELS_LENGHT).fill('#ffffff32')

const MOCK_PIXELS = [
  '#187a23',
  '#ff7a30',
  '#187a23',
  '#187a23',
  '#ff7a30',
  '#ff7a30',
  '#ff7a30',
  '#ff7a30',
  '#7ad63a',
  '#187a23',
  '#7ad63a',
  '#7ad63a',
  '#187a23',
  '#ff7a30',
  '#ff7a30',
  '#ff7a30',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#7ad63a',
  '#187a23',
  '#ff7a30',
  '#ff7a30',
  '#ffffff',
  '#000000',
  '#ffffff',
  '#000000',
  '#ffffff',
  '#187a23',
  '#ff7a30',
  '#ff7a30',
  '#ffffff',
  '#000000',
  '#ffffff',
  '#000000',
  '#ffffff',
  '#187a23',
  '#ff7a30',
  '#ff7a30',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#ffffff',
  '#187a23',
  '#187a23',
  '#187a23',
  '#ffffff',
  '#ffffff',
  '#7ad63a',
  '#ffffff',
  '#187a23',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a',
  '#7ad63a'
]
