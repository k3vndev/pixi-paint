import Image from 'next/image'
import type { Game as GameType } from '@/app/play/page'
import { FONTS } from '@/consts'

interface Props extends GameType {
  index: number
  onClick?: () => void
}

export const GameTile = ({ name, index, details, onClick }: Props) => {
  const animationDelay = `${(index + 1) * 100}ms`

  const outerStyle = details
    ? 'hover:brightness-115 hover:scale-101 active:scale-95 active:brightness-90 border-theme-10 justify-between'
    : 'opacity-75 border-theme-10/25 justify-center not-sm:py-8'

  return (
    <article
      className={`
        relative xl:h-142 lg:h-124 sm:h-1/3 h-fit border-2 
        xl:w-96 lg:w-72 w-full gap-1 flex lg:flex-col not-sm:flex-col items-center
        sm:max-w-xl max-w-96
        
        text-center text-theme-10 font-semibold overflow-clip group bg-theme-20/35 rounded-2xl 
        transition duration-300 animate-slide-in-bottom [animation-fill-mode:backwards]
        ${outerStyle} 
      `}
      style={{ animationDelay }}
      onClick={onClick}
    >
      {details ? (
        // GameTile main content
        <>
          <div className='flex flex-col gap-4 items-center lg:mt-16 not-sm:mt-8'>
            <span className={`${FONTS.POPPINS} sm:text-4xl text-3xl font-extrabold text-nowrap`}>
              {name.toUpperCase()}
            </span>
            <span className='text-xl xl:px-10 px-4 text-theme-10/80 not-sm:max-w-96'>{details.desc}</span>
          </div>

          <Image
            className={`
              aspect-square lg:w-full not-lg:h-full w-fit not-sm:w-64 object-cover
              animate-slide-in-bottom [animation-fill-mode:backwards] 
              transition duration-300 group-hover:-translate-y-2 group-hover:scale-102
            `}
            src={details.img}
            width={512}
            height={512}
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
