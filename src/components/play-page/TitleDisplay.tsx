import { useState } from 'react'
import { Z_INDEX } from '@/consts'

interface TitleDisplayState {
  messages: string[]
  show: boolean
}

export const TitleDisplay = ({ messages, show }: TitleDisplayState) => {
  const visibility = show ? 'animate-slide-in-top' : 'animate-slide-out-top'

  return messages.length ? (
    <span
      className={`
        absolute text-theme-10 ${Z_INDEX.TOOLTIP} ${visibility}
        bg-theme-bg/90 py-5 px-6 backdrop-blur-xl pointer-events-none
        rounded-2xl border-2 border-theme-20 shadow-card
      `}
    >
      <div
        className={`
          flex flex-col gap-2 items-center px-8
          border-l-4 border-r-4 border-theme-10/25 border-dashed
        `}
      >
        {messages.map((msg, i) => (
          <span key={i} className={`${!i ? 'font-bold text-5xl' : 'font-semibold text-4xl'}`}>
            {msg}
          </span>
        ))}
      </div>
    </span>
  ) : null
}

export const useTitleDisplay = () => {
  const [titleState, setTitleState] = useState<TitleDisplayState>({ show: false, messages: [] })

  const displayTitle = (...messages: string[]) => {
    setTitleState({ messages, show: true })
  }

  const hideTitle = () => {
    setTitleState(m => ({ ...m, show: false }))
  }

  return { displayTitle, hideTitle, titleState }
}
