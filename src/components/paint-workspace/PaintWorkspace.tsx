import { Colorbar } from './colorbar/Colorbar'
import { PaintCanvas } from './paint-canvas/PaintCanvas'
import { ToolBar } from './toolbar/Toolbar'

export const PaintWorkspace = () => {
  return (
    <>
      <PaintCanvas />
      <ToolBar />
      <Colorbar />
    </>
  )
}
