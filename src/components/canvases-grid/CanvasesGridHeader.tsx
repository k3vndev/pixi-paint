import { Z_INDEX } from '@consts'
import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export const CanvasesGridHeader = ({ children, className = '', ...props }: Props) => (
  <header
    className={twMerge(`
      fixed w-full left-0 top-[calc(var(--navbar-height)-1px)] backdrop-blur-md ${Z_INDEX.NAVBAR}
      bg-gradient-to-b from-30% from-theme-bg to-theme-bg/50
      flex gap-5 py-6 px-[var(--galery-pad-x)] border-theme-20/50 ${className}
    `)}
    {...props}
  >
    {children}
  </header>
)
