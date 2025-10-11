import { BLANK_PIXELS, COLOR_PALETTE, Z_INDEX } from '@consts'
import { useEffect, useState } from 'react'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { usePaintStore } from '@/store/usePaintStore'
import { calcPaintingsSimilarity } from '@/utils/calcPaintingsSimilarity'
import { waitForSeconds } from '@/utils/waitForSeconds'
import { PaintWorkspace } from '../paint-workspace/PaintWorkspace'

export const SpeedPaintGame = () => {
  const [displayMessages, setDisplayMessages] = useState<string[]>([])
  const [isShowingCanvas, setIsShowingCanvas] = useState(false)
  const [canvasIsDisabled, setCanvasIsDisabled] = useState(true)

  const editingPixels = usePaintStore(s => s.pixels)
  const setEditingPixels = usePaintStore(s => s.setPixels)

  const [timer, setTimer] = useState(-1)

  const setPrimaryColor = usePaintStore(s => s.setPrimaryColor)
  const setSecondaryColor = usePaintStore(s => s.setSecondaryColor)

  const refs = useFreshRefs({ editingPixels })

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
    setEditingPixels(BLANK_PIXELS)
    setIsShowingCanvas(true)

    await waitForSeconds(0.4)
    setDisplayMessages(['MEMORIZE', 'THE PAINTING'])
    await waitForSeconds(2)
    setDisplayMessages([])
    await waitForSeconds(0.2)

    setEditingPixels(MOCK_PIXELS)

    runTimer(3)
    await waitForSeconds(3)

    // Run timer here

    setEditingPixels(BLANK_PIXELS)
    setCanvasIsDisabled(false)

    runTimer(45)
    await waitForSeconds(45)

    setCanvasIsDisabled(true)

    // Wait for the user to view
    runTimer(1.5)
    await waitForSeconds(1.5)

    // Calculate results here
    console.log('Total score:', calcPaintingsSimilarity(MOCK_PIXELS, refs.current.editingPixels))
  }

  return (
    <>
      {displayMessages.length > 0 && (
        <span
          className={`
            absolute text-theme-10 font-semibold text-5xl
            animate-slide-in-left ${Z_INDEX.TOOLTIP}
            bg-theme-bg/90 py-5 px-6 rounded-2xl border-2 backdrop-blur-xl border-theme-20 shadow-card
          `}
        >
          <div
            className={`
              flex flex-col gap-1 items-center px-8
              border-l-4 border-r-4 border-theme-10/25 border-dashed
            `}
          >
            {displayMessages.map((line, i) => (
              <span key={i} className={`${!i ? 'font-black' : ''}`}>
                {line}
              </span>
            ))}
          </div>
        </span>
      )}

      {isShowingCanvas && <PaintWorkspace disabled={canvasIsDisabled} hideColorbarSelector />}

      {timer > 0 && (
        <span className='fixed right-8 bottom-8 text-xl text-theme-10 font-mono'>{timer.toFixed(2)}</span>
      )}
    </>
  )
}

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
