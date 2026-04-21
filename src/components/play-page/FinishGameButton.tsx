import { ColoredPixelatedImage } from '../images/ColoredPixelatedImage'
import { Item } from '../paint-workspace/toolbar/Item'

interface Props {
  disabled?: boolean
  onClick?: () => void
}

export const FinishGameButton = ({ disabled, onClick }: Props) => (
  <button className='not-lg:ml-1 relative' disabled={disabled} onClick={onClick}>
    <Item className='size-full flex justify-center items-center not-lg:rounded-full not-lg:scale-90'>
      <ColoredPixelatedImage icon='check' className='bg-theme-10 min-w-12 size-4/5 aspect-square' />
    </Item>
  </button>
)
