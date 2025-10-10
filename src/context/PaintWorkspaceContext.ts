import type { CanvasOutlineConfig } from '@@/paint-workspace/paint-canvas/CanvasOutline'
import { createContext, useContext } from 'react'

interface PaintWorkspaceContext {
  outlineConfig: CanvasOutlineConfig
  disabled: boolean
  elementStyle: string
}

export const PaintWorkspaceContext = createContext<PaintWorkspaceContext>({
  outlineConfig: {},
  disabled: false,
  elementStyle: ''
})

export const usePaintWorkspaceContext = () => useContext(PaintWorkspaceContext)
