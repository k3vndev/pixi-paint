import { FONTS } from '@/consts'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZone } from '../dialog-menu/DMZone'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'

interface Props {
  score: number
  originalPixels: string[]
  editingPixels: string[]
  restartMinigame: () => void
}

export const ResultsMenu = ({ score, originalPixels, editingPixels, restartMinigame }: Props) => {
  const scorePercentage = (score * 100).toFixed(0)
  const messageStart = (() => {
    if (score === 1) return 'Pixel art master!'
    if (score > 0.85) return 'You nailed it!'
    if (score > 0.6) return 'Not bad at all!'
    if (score > 0.25) return 'Could be worse!'
    return 'Better luck next time!'
  })()

  return (
    <>
      <DMHeader icon='gamepad'>Your results</DMHeader>
      <DMParagraph className='text-center gap-0 md:mb-5 mb-2'>
        <span className='text-xl italic'>{messageStart}</span>
        <span className='font-semibold'>You got a score of {scorePercentage}%</span>
      </DMParagraph>

      <DMZone className='flex md:gap-8 gap-4'>
        <CanvasDisplay pixels={originalPixels} label='Original' />
        <CanvasDisplay pixels={editingPixels} label='Yours' />
      </DMZone>

      <DMZoneButtons>
        <DMButton icon='cross' empty>
          Minigames selection
        </DMButton>
        <DMButton icon='gamepad' onClick={restartMinigame}>
          Play again
        </DMButton>
      </DMZoneButtons>
    </>
  )
}

interface CanvasDisplayProps {
  pixels: string[]
  label: string
}

const CanvasDisplay = ({ pixels, label }: CanvasDisplayProps) => (
  <div className='flex md:flex-col items-center md:gap-2 gap-1 relative not-md:-translate-x-4'>
    <DMCanvasImage pixels={pixels} />
    <span
      className={`text-theme-10 font-semibold text-xl ${FONTS.POPPINS} not-md:absolute not-md:right-0 not-md:rotate-90 not-md:translate-x-4/5`}
    >
      {label}
    </span>
  </div>
)
