import { ColoredPixelatedImage } from '../images/ColoredPixelatedImage'

interface Props {
  canvasIsSelected: boolean
}

export const SelectionBox = ({ canvasIsSelected }: Props) => {
  const selectedState = canvasIsSelected ? 'scale-110' : 'opacity-0 scale-150 blur-xl'

  return (
    <div
      className={`
        absolute right-[var(--creations-canvas-pad)] top-[var(--creations-canvas-pad)]
        size-14 border-2 border-theme-10/50 flex items-center justify-center
        bg-theme-bg/80 backdrop-blur-xs rounded-md shadow-card
        animate-fade-in anim-duration-200 anim-scale-80 anim-blur-lg anim-ease-out-sine
      `}
    >
      <ColoredPixelatedImage
        icon='check'
        className={`size-full transition-all duration-200 ${selectedState}`}
      />
    </div>
  )
}
