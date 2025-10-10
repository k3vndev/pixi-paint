import { SPRITES_SIZE } from '@consts'
import { createContext, useContext } from 'react'

interface ToolbarContext {
  spriteSize: number
}

export const ToolbarContext = createContext<ToolbarContext>({
  spriteSize: SPRITES_SIZE
})

export const useToolbarContext = () => useContext(ToolbarContext)
