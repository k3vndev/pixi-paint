'use client'
import { useRef } from 'react'
import { CanvasImage } from '@/components/images/CanvasImage'
import { FONTS } from '@/consts'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { usePerspectiveHover } from '@/hooks/usePerspectiveHover'

export default function NotFoundPage() {
  useDefaultPrevention()
  const animation = 'anim-blur-lg anim-opacity-0 anim-duration-1000 anim-ease-out-back'

  return (
    <div className='h-dvh w-dvw flex items-center justify-center flex-col md:gap-10 gap-6 text-center text-theme-10 text-pretty'>
      <h1
        className={`font-bold lg:text-6xl sm:text-5xl text-3xl ${FONTS.POPPINS} ${animation} animate-slide-in-t anim-delay-600`}
      >
        Page not found.
      </h1>

      <div className='w-[calc(100vw-3rem)] md:gap-4 gap-2 items-center flex lg:max-w-3xl max-w-lg'>
        {dataUrls.map((d, i) => (
          <NotFoundCanvasImage dataUrl={d} index={i} key={d} />
        ))}
      </div>

      <p
        className={`md:text-2xl text-lg text-theme-10/50 px-4 ${FONTS.INTER} ${animation} animate-slide-in-b anim-delay-800`}
      >
        The page you’re trying to access does not exist :(
      </p>
    </div>
  )
}

interface NotFoundCanvasImageProps {
  dataUrl: string
  index: number
}

const NotFoundCanvasImage = ({ dataUrl, index }: NotFoundCanvasImageProps) => {
  const ref = useRef<HTMLElement>(null)
  const { parentStyle, elementStyle } = usePerspectiveHover({ ref, rotationOffset: 30 })
  const animationDelay = `${(index + 1) * 100}ms`

  return (
    <div
      className='w-full animate-fade-in anim-scale-50 anim-ease-out-back anim-blur-md'
      style={{ ...parentStyle, animationDelay }}
    >
      <CanvasImage
        ref={ref}
        className='w-full aspect-square active:scale-95'
        dataUrl={dataUrl}
        style={elementStyle}
      />
    </div>
  )
}

const dataUrls = [
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAASUlEQVR4AZSOywkAIAxDi2u4gydHcAoHdCA38OAc2hQCXvwVHn2FEOpaiuOEEx0figBV23TcFoDs+Aus1fS3hl6zEP6CG35tmAAAAP//3mjwAgAAAAZJREFUAwDTVyCvOJ3f9wAAAABJRU5ErkJggg==',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAASElEQVR4AZSO2wkAIAhFLy1R/63VV2M0TF8t1xSlgaDQg4SDwj2KLpQ4bjhQ5eSxgyIsgYcTRqitg9GyEXQg858gj8o29+eFCQAA//+FGoDBAAAABklEQVQDADqKGK8BJMvdAAAAAElFTkSuQmCC',
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAARUlEQVR4AZSOywkAIAxDg6s4h9N4cyC3cxNBm0LAi7/Co68QQkPKfZwIsIkFIKa+5bw9QNnxF1ir5W8NrQJCv/CmXxsmAAAA//8gXSjcAAAABklEQVQDALIrHgN4SSobAAAAAElFTkSuQmCC'
]
