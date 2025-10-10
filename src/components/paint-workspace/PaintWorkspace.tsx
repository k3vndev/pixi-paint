import { PaintWorkspaceContext } from '@/context/PaintWorkspaceContext'
import { Colorbar } from './colorbar/Colorbar'
import type { CanvasOutlineConfig } from './paint-canvas/CanvasOutline'
import { PaintCanvas } from './paint-canvas/PaintCanvas'
import { ToolBar } from './toolbar/Toolbar'

interface Props {
  disabled?: boolean
  toolbarExtraItem?: React.ReactNode
  outlineConfig?: CanvasOutlineConfig
}

export const PaintWorkspace = ({ disabled = false, outlineConfig = {}, toolbarExtraItem }: Props) => {
  const disabledStyle = disabled ? 'pointer-events-none opacity-25' : 'opacity-100'
  const elementStyle = `transition duration-300 ${disabledStyle}`

  return (
    <PaintWorkspaceContext.Provider value={{ disabled, elementStyle, outlineConfig }}>
      <PaintCanvas />

      <ToolBar extraItem={toolbarExtraItem} />
      <Colorbar />
    </PaintWorkspaceContext.Provider>
  )
}
