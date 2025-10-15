import Image from 'next/image'
import { FONTS } from '@/consts'
import type { Minigame } from './MinigamesSelection'

interface Props extends Minigame {
  index: number
  onClick?: () => void
}

export const MinigameTile = ({ name, index, details, onClick }: Props) => {
  const animationDelay = `${(index + 1) * 100}ms`
  const animation = 'lg:animate-slide-in-bottom animate-slide-in-left'
  const imageSize = 512

  const outerStyle = details
    ? 'hover:brightness-115 hover:scale-101 active:scale-95 active:brightness-90 border-theme-10 justify-between'
    : 'opacity-25 border-theme-10/25 justify-center not-sm:min-h-64'

  return (
    <article
      className={`
        relative xl:h-142 lg:h-124 sm:h-72 border-2 
        xl:w-96 lg:w-72 w-full gap-1 flex lg:flex-col not-sm:flex-col items-center
        sm:max-w-xl max-w-96
        
        text-center text-theme-10 font-semibold overflow-clip group bg-theme-20/35 rounded-2xl 
        transition duration-300 [animation-fill-mode:backwards]
        lg:animate-slide-in-bottom animate-slide-in-left
        ${animation} ${outerStyle} 
      `}
      style={{ animationDelay }}
      onClick={onClick}
    >
      {details ? (
        // GameTile main content
        <>
          <TextContent {...{ title: name, desc: details.desc }} />

          <Image
            className={`
              aspect-square lg:w-full not-lg:h-full w-fit not-sm:w-64 object-cover
              [animation-fill-mode:backwards] ${animation}
              transition duration-300 group-hover:-translate-y-2 group-hover:scale-102
            `}
            src={details.img}
            width={imageSize}
            height={imageSize}
            style={{ animationDelay }}
            alt={`A quick preview of the ${name} minigame`}
          />
        </>
      ) : (
        // Fallback content with a coming soon
        <div className='flex flex-col items-center my-auto'>
          <span className='text-4xl'>{name}</span>
          <span className='text-xl animate-pulse'>Coming soon...</span>
        </div>
      )}
    </article>
  )
}

interface TextContentProps {
  title: string
  desc: string
}

const TextContent = ({ title, desc }: TextContentProps) => (
  <div className='flex flex-col gap-4 items-center lg:mt-16 not-sm:mt-8'>
    <span
      className={`
        ${FONTS.POPPINS} sm:text-4xl text-3xl 
        font-extrabold text-nowrap
      `}
    >
      {title.toUpperCase()}
    </span>
    <span
      className={`
        text-xl xl:px-10 px-4 text-theme-10/80 
        not-sm:max-w-96
      `}
    >
      {desc}
    </span>
  </div>
)
