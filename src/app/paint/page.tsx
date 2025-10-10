'use client'

import { PaintWorkspace } from '@@/paint-workspace/PaintWorkspace'
import { useBodyClassName } from '@/hooks/useBodyClassName'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useResetScroll } from '@/hooks/useResetScroll'
import { useStorageCanvases } from '@/hooks/useStorageCanvases'

export default function PaintPage() {
  useDefaultPrevention()
  useResetScroll()
  useBodyClassName('overflow-hidden')

  useStorageCanvases()

  return (
    <main
      className={`
        relative w-screen h-[calc(100dvh-var(--navbar-height))] mt-[var(--navbar-height)]
        flex justify-center items-center
      `}
    >
      <PaintWorkspace />
    </main>
  )
}
