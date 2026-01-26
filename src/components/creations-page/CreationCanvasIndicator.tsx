import type { IconName, ReusableComponent } from '@types'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../images/ColoredPixelatedImage'

type Props = {
  children?: React.ReactNode
  icon?: IconName
} & ReusableComponent

export const CreationCanvasIndicator = ({ children, icon, className = '', ...props }: Props) => {
  return (
    <span
      className={twMerge(`
        opacity-100 xl:text-2xl sm:text-lg font-bold text-theme-10 sm:px-1 px-0.5 md:h-11 sm:h-9 h-7
        flex items-center bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card
        animate-fade-in anim-scale-0 anim-ease-out-back
        ${className}
      `)}
      {...props}
    >
      {icon ? <ColoredPixelatedImage icon={icon} className='bg-theme-10 sm:size-10 size-8' /> : children}
    </span>
  )
}
