'use client'

import { Z_INDEX } from '@consts'
import { Routes } from './Routes'

export const Navbar = () => (
  <aside
    className={`
      fixed top-0 left-0 flex gap-3 justify-center items-end
       h-(--navbar-height) min-h-(--navbar-height) max-h-(--navbar-height) w-dvw
      bg-theme-bg border-b-4 border-b-theme-20 ${Z_INDEX.NAVBAR}
      animate-slide-in-t anim-blur-sm anim-delay-100 anim-slide-move-sm
    `}
  >
    <Routes />

    {/* Background */}
    <div
      className={`
        absolute top-0 left-0 size-full bg-gradient-to-t
        from-black/20 to-black/25 -z-50
      `}
    >
      <div
        className='size-full opacity-25 animate-fade-in-slow'
        style={{
          backgroundImage: 'url(/gifs/squares.gif)',
          backgroundSize: 'calc(var(--navbar-height)*0.9)'
        }}
      />
    </div>
  </aside>
)
