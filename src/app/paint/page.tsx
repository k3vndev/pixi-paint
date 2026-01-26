'use client'

import { PaintWorkspace } from '@@/paint-workspace/PaintWorkspace'
import type { CanvasOutlineConfig } from '@@/paint-workspace/paint-canvas/CanvasOutline'
import { SaveHandler } from '@@/paint-workspace/toolbar/SaveHandler'
import { useEffect, useState } from 'react'
import { useBodyClassName } from '@/hooks/useBodyClassName'
import { useDebounce } from '@/hooks/useDebounce'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useResetScroll } from '@/hooks/useResetScroll'
import { useStorageCanvases } from '@/hooks/useStorageCanvases'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { usePaintStore } from '@/store/usePaintStore'

export default function PaintPage() {
  useDefaultPrevention()
  useResetScroll()
  useBodyClassName('overflow-hidden')
  useStorageCanvases()

  const { outlineConfig } = usePaintPageCanvas()

  return (
    <main
      className={`
        relative w-screen h-[calc(100dvh-var(--navbar-height))] mt-[var(--navbar-height)]
        flex justify-center items-center
      `}
    >
      <PaintWorkspace toolbarItemSlot={<SaveHandler />} {...{ outlineConfig }} />
    </main>
  )
}

const usePaintPageCanvas = () => {
  const hydrated = useCanvasesStore(s => s.hydrated)
  const editingCanvasId = useCanvasesStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasesStore(s => s.setEditingCanvasId)
  const [outlineConfig, setOutlineConfig] = useState<CanvasOutlineConfig>({})

  const draft = useCanvasesStore(s => s.draftCanvas)
  const setDraftPixels = useCanvasesStore(s => s.setDraftCanvasPixels)

  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)

  const editingPixels = usePaintStore(s => s.pixels)
  const setEditingPixels = usePaintStore(s => s.setPixels)
  const debouncedEditingPixels = useDebounce(editingPixels, 300)

  const refs = useFreshRefs({ hydrated, draft, savedCanvases, outlineConfig, editingCanvasId })

  // Load the correct painting on startup
  useEffect(() => {
    if (!hydrated) return
    const { draft, savedCanvases } = refs.current

    // Check if the user left an open canvas
    if (editingCanvasId) {
      const foundCanvas = savedCanvases.find(c => c.id === editingCanvasId)

      if (foundCanvas) {
        setEditingPixels(foundCanvas.pixels)
        return
      }
    }

    // If not, load draft
    setEditingCanvasId(null)
    setEditingPixels(draft.pixels)
  }, [hydrated])

  // Handle outline visibility
  useEffect(() => {
    const isDraft = editingCanvasId === null

    setOutlineConfig({
      ...refs.current.outlineConfig,
      visible: !isDraft
    })
  }, [editingCanvasId])

  // Save to store (draft or saved canvas) when editingPixels change
  useEffect(() => {
    const { editingCanvasId, hydrated } = refs.current
    if (!hydrated || !debouncedEditingPixels.length) return

    // Update draft
    if (editingCanvasId === null && hydrated) {
      setDraftPixels(debouncedEditingPixels)
      return
    }

    // Update saved
    const index = savedCanvases.findIndex(c => c.id === editingCanvasId)
    if (index === -1) return

    setSavedCanvases(newCanvases => {
      newCanvases[index] = {
        ...newCanvases[index],
        pixels: debouncedEditingPixels
      }
      return newCanvases
    })
  }, [debouncedEditingPixels])

  return { outlineConfig }
}
