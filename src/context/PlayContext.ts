import { createContext, useContext } from 'react'

interface PlayContext {
  isRenderingGame: boolean
  setIsRenderingGame: (value: boolean) => void
}

export const PlayContext = createContext<PlayContext>({
  isRenderingGame: false,
  setIsRenderingGame: () => {}
})

export const usePlayContext = () => useContext(PlayContext)
