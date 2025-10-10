import { CANVAS_RESOLUTION, HTML_IDS } from '@consts'
import { CanvasPixel } from '@/components/paint-workspace/paint-canvas/CanvasPixel'
import { usePaintWorkspaceContext } from '@/context/PaintWorkspaceContext'
import { usePaintCanvas } from '@/hooks/usePaintCanvas'
import { useCanvasPixelsAppearing } from '@/hooks/usePixelsAppearing'
import { useUserPublishedIds } from '@/hooks/useUserPublishedIds'
import { CanvasOutline } from './CanvasOutline'

export const PaintCanvas = () => {
  const { pixels, canvasRef } = usePaintCanvas()
  const { visiblePixelsMap } = useCanvasPixelsAppearing(pixels)

  const { disabled } = usePaintWorkspaceContext()
  const disabledStyle = disabled ? 'pointer-events-none' : ''

  const gridTemplateColumns = `repeat(${CANVAS_RESOLUTION}, minmax(0, 1fr))`
  useUserPublishedIds()

  return (
    <CanvasOutline>
      <div
        className={`
          content-center size-[var(--canvas-size)] grid 
          overflow-clip rounded-md relative ${disabledStyle}
        `}
        style={{ gridTemplateColumns }}
        draggable={false}
        ref={canvasRef}
        id={HTML_IDS.PAINT_CANVAS}
      >
        {pixels.map((pixelColor, i) => (
          <CanvasPixel isVisible={visiblePixelsMap[i]} color={pixelColor} index={i} key={i} />
        ))}
      </div>
    </CanvasOutline>
  )
}
