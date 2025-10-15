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
        bg-theme-bg/90 lg:p-6 py-3 px-2 backdrop-blur-xl pointer-events-none
        lg:rounded-3xl rounded-2xl border-2 border-theme-20 shadow-card
      `}
    >
      <div
        className={`
          flex flex-col lg:gap-2 items-center lg:px-8 px-4
          lg:border-x-4 border-x-3 border-theme-10/25 border-dashed
        `}
      >
        {messages.map((msg, i) => (
          <span
            key={i}
            className={`${
              !i
                ? 'font-bold lg:text-5xl sm:text-3xl text-xl animate-pulse-brightness'
                : 'font-semibold lg:text-4xl sm:text-2xl text-lg'
            }`}
          >
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
