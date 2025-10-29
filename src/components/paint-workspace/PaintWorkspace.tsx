import { PaintWorkspaceContext } from '@/context/PaintWorkspaceContext'
import { Colorbar } from './colorbar/Colorbar'
import type { CanvasOutlineConfig } from './paint-canvas/CanvasOutline'
import { PaintCanvas } from './paint-canvas/PaintCanvas'
import { ToolBar } from './toolbar/Toolbar'

interface Props {
  disabled?: boolean
  toolbarExtraItem?: React.ReactNode
  outlineConfig?: CanvasOutlineConfig
  hideColorbarSelector?: boolean
}

export const PaintWorkspace = ({
  disabled = false,
  outlineConfig = {},
  toolbarExtraItem,
  hideColorbarSelector = false
}: Props) => {
  const disabledStyle = disabled ? 'pointer-events-none opacity-25' : 'opacity-100'

  const elementStyle = `
    anim-fill-backwards anim-blur-lg anim-ease-out-back anim-opacity-0
    transition-all duration-700 ${disabledStyle}
  `

  return (
    <PaintWorkspaceContext.Provider value={{ disabled, elementStyle, outlineConfig, hideColorbarSelector }}>
      <PaintCanvas />

      <ToolBar extraItem={toolbarExtraItem} />
      <Colorbar />
    </PaintWorkspaceContext.Provider>
  )
}
