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
import type { CanvasOutlineConfig } from '../paint-workspace/paint-canvas/CanvasOutline'
import { TitleDisplay, useTitleDisplay } from './TitleDisplay'

export const PaintMinigame = () => {
  const [isShowingCanvas, setIsShowingCanvas] = useState(false)
  const [canvasIsDisabled, setCanvasIsDisabled] = useState(true)

  const editingPixels = usePaintStore(s => s.pixels)
  const setEditingPixels = usePaintStore(s => s.setPixels)

  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

  const [canvasOutlineConfig, setCanvasOutlineConfig] = useState<CanvasOutlineConfig>({})

  const refs = useFreshRefs({ editingPixels, canvasOutlineConfig })

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

  const canvasOutlineTimer = {
    start: (time: number) => {
      const { canvasOutlineConfig } = refs.current
      setCanvasOutlineConfig({
        ...canvasOutlineConfig,

        conicTimer: {
          visible: true,
          activeTimerTime: time
        }
      })
    },
    setVisible: (value: boolean, inactiveValue?: number) => {
      setCanvasOutlineConfig({
        ...refs.current.canvasOutlineConfig,
        conicTimer: { visible: value, inactiveValue }
      })
    },
    initialize: () => {
      setCanvasOutlineConfig({
        visible: true,
        conicTimer: { visible: true}
      })
    }
  }

  const mainSequence = async () => {
    await waitForSeconds(0.1)

    setEditingPixels(SEMI_TRANSPARENT_PIXELS)
    setIsShowingCanvas(true)

    await waitForSeconds(0.4)

    // Display title and initialize canvas outline
    displayTitle('REMEMBER', 'THIS PAINTING...')
    canvasOutlineTimer.initialize()
    await waitForSeconds(1.5)
    hideTitle()

    canvasOutlineTimer.setVisible(false)
    await waitForSeconds(0.25)

    animateSetPixels(MOCK_PIXELS)
    await waitForSeconds(0.5)

    const peekTime = 5.5
    canvasOutlineTimer.start(peekTime)
    await waitForSeconds(peekTime)

    canvasOutlineTimer.setVisible(true)

    animateSetPixels(BLANK_PIXELS)
    await waitForSeconds(0.4)

    canvasOutlineTimer.setVisible(false)

    displayTitle('PAINT!')
    await waitForSeconds(0.7)
    hideTitle()

    await waitForSeconds(0.5)

    const paintTime = 45
    setCanvasIsDisabled(false)

    canvasOutlineTimer.start(paintTime)
    await waitForSeconds(paintTime)

    await waitForSeconds(0.2)
    setCanvasIsDisabled(true)

    displayTitle('TIME!')
    await waitForSeconds(0.7)
    hideTitle()

    // Wait for the user to view
    await waitForSeconds(1.3)

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
      {isShowingCanvas && (
        <PaintWorkspace
          disabled={canvasIsDisabled}
          outlineConfig={canvasOutlineConfig}
          hideColorbarSelector
        />
      )}

      <TitleDisplay {...titleState} />
    </>
  )
}

const SEMI_TRANSPARENT_PIXELS = Array(CANVAS_PIXELS_LENGHT).fill('#ffffff64')

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
