import type { ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { usePaintWorkspaceContext } from '@/context/PaintWorkspaceContext'

type Props = {
  children?: React.ReactNode
} & ReusableComponent

export interface CanvasOutlineConfig {
  visible?: boolean
  className?: string
  style?: React.CSSProperties
}

export const CanvasOutline = ({ children, className = '' }: Props) => {
  const { outlineConfig } = usePaintWorkspaceContext()
  const backgroundSize = outlineConfig.visible ? BG_SIZES.SHOWN : BG_SIZES.HIDDEN

  return (
    <div
      className={twMerge(`
        relative size-[calc(var(--canvas-size)+(var(--canvas-outline-w)*2))]
        overflow-clip rounded-2xl flex justify-center items-center
        p-[calc(var(--canvas-outline-w)*0.43)] ${className} 
      `)}
    >
      <div
        className={twMerge(`
          bg-gradient-to-r from-theme-10 to-theme-20 -z-10 pointer-events-none
          absolute rounded-full blur-sm  ease-in-out top-1/2 left-1/2 -translate-1/2 
          animate-spin transition-all ${backgroundSize} ${outlineConfig.className ?? ''}
        `)}
        style={outlineConfig.style}
      />
      <div
        className={`
          size-full flex justify-center items-center 
          bg-theme-bg rounded-xl
        `}
      >
        {children}
      </div>
    </div>
  )
}

const BG_SIZES = {
  HIDDEN: 'size-[70%] duration-1200',
  SHOWN: 'size-[150%] duration-2100'
}
