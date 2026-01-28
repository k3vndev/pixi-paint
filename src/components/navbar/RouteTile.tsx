import type { IconName, ReusableComponent } from '@types'
import { useRouter } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { ColoredPixelatedImage } from '../images/ColoredPixelatedImage'

type Props = {
  name: string
  icon?: IconName
  path?: string
  isSelected?: boolean
  index: number
} & ReusableComponent

export const RouteTile = ({
  name,
  icon,
  path,
  isSelected = false,
  className = '',
  index,
  ...props
}: Props) => {
  const router = useRouter()

  const handleClick = () => {
    path && router.push(path)
  }

  const style = isSelected
    ? 'bg-theme-bg border-theme-20 lg:py-4 py-3 translate-y-[4.1px] anim-opacity-100'
    : 'active:brightness-60 active:scale-90'

  const animationDelay = isSelected ? '0' : `${100 * (index + 1)}ms`

  return (
    <button
      className={twMerge(`
        lg:py-2.5 py-1.5 lg:px-10 md:px-12 px-8 font-semibold text-xl 
        bg-black text-theme-10 origin-bottom text-nowrap
        rounded-t-2xl border-4 border-b-0 border-transparent flex items-center lg:gap-2 gap-1

        [transition:padding_250ms_ease,scale_150ms_ease]

        animate-fade-in anim-scale-0 anim-ease-out-back anim-fill-backwards
        ${style} ${className}
      `)}
      onClick={handleClick}
      style={{ animationDelay, ...props.style }}
      ref={props.ref}
    >
      {icon && <ColoredPixelatedImage icon={icon} />}
      {name}
    </button>
  )
}
