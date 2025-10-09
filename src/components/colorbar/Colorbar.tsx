import { ZoneWrapper } from '../ZoneWrapper'
import { Palette } from './Palette'
import { Selector } from './selector/Selector'

export const Colorbar = () => (
  <ZoneWrapper
    className={`
      absolute lg:right-[var(--sidebar-margin)] lg:py-6 md:p-4 p-3 
      animate-slide-in-right lg:w-fit w-[var(--w-screen-minus-pad)]
      not-lg:top-[var(--sidebar-margin)]
    `}
  >
    <aside className='flex lg:flex-col lg:gap-7 md:gap-6 gap-4 items-center justify-between'>
      <Palette />
      <Selector />
    </aside>
  </ZoneWrapper>
)
