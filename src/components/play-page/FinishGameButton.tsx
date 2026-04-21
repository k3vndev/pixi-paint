import { useRef } from 'react'
import { useTooltip } from '@/hooks/useTooltip'
import { ColoredPixelatedImage } from '../images/ColoredPixelatedImage'
import { Item } from '../paint-workspace/toolbar/Item'

interface Props {
  disabled?: boolean
  onClick?: () => void
}

export const FinishGameButton = ({ disabled, onClick }: Props) => {
  const ref = useRef<HTMLButtonElement>(null)
  useTooltip({ ref, text: "I've finished!", showWhen: !disabled })

  return (
    <button ref={ref} className='not-lg:ml-1 relative' disabled={disabled} onClick={onClick}>
      <Item className='size-full flex justify-center items-center not-lg:rounded-full not-lg:scale-90'>
        <ColoredPixelatedImage icon='check' className='bg-theme-10 min-w-12 size-4/5 aspect-square' />
      </Item>
    </button>
  )
}
