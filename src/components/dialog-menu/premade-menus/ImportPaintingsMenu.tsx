import type { JSONCanvas, SavedCanvas } from '@types'
import { useRef } from 'react'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useFreshRefs } from '@/hooks/useFreshRefs'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { canvasParser } from '@/utils/canvasParser'
import { DMButton } from '../DMButton'
import { DMDragNDrop } from '../DMDragNDrop'
import { DMHeader } from '../DMHeader'
import { DMParagraph } from '../DMParagraph'

export const ImportPaintingsMenu = () => {
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)
  const savedCanvasesRef = useFreshRefs(useCanvasesStore(s => s.savedCanvases))
  const refreshUserPublishedIds = useRemoteStore(s => s.refreshUPI)

  const importErrorRef = useRef<string | null>(null)

  const { closeMenu, openMenu, refreshPosition } = useDialogMenu()

  const parseImportedCanvases = (contents: string[]): SavedCanvas[] | null => {
    const jsonCanvases: JSONCanvas[] = []
    let invalidCanvasesCount = 0

    // Parse and contents into an one level array
    for (const content of contents) {
      try {
        const raw: JSONCanvas | JSONCanvas[] = JSON.parse(content)
        Array.isArray(raw) ? jsonCanvases.push(...raw) : jsonCanvases.push(raw)
      } catch {
        importErrorRef.current = 'Tried to import an invalid file! Paintings must be in valid JSON format.'
        return null
      }
    }

    // Filter valid imported canvases
    const validatedImportedCanvases: SavedCanvas[] = []

    for (const jsonCanvas of jsonCanvases) {
      const parsed = canvasParser.fromStorage(jsonCanvas)
      if (parsed) {
        validatedImportedCanvases.push(parsed)
      } else {
        invalidCanvasesCount++
      }
    }

    // If no valid canvases were found, return null
    if (validatedImportedCanvases.length === 0) {
      importErrorRef.current = 'Tried to import paintings, but none were valid!'
      return null
    }

    // Notify about invalid canvases if any
    if (invalidCanvasesCount) {
      importErrorRef.current = `${invalidCanvasesCount} of the imported paintings were not valid so we are skipping them...`
    }

    return validatedImportedCanvases
  }

  const onDropOrSelect = (contents: string[]) => {
    closeMenu()
    const importedCanvases = parseImportedCanvases(contents)

    // Show import errors if any
    if (importErrorRef.current) {
      openMenu(
        <>
          <DMHeader icon='cross'>Import error</DMHeader>
          <DMParagraph className='max-w-md'>{importErrorRef.current}</DMParagraph>
        </>
      )
    }

    if (importedCanvases === null) return

    setSavedCanvases(s => [...s, ...importedCanvases])

    // Refresh user published canvases ids
    requestAnimationFrame(() => {
      refreshUserPublishedIds(savedCanvasesRef.current)
    })
  }

  return (
    <>
      <DMHeader icon='code' className='border-none mb-0'>
        Paintings importer
      </DMHeader>
      <DMDragNDrop
        className='w-full max-w-128 my-1 md:px-10 px-4'
        acceptedFormats={['application/json']}
        allowMultipleFiles
        {...{ onDropOrSelect, refreshPosition }}
      >
        Drag & Drop compatible JSON files here, or click to choose...
      </DMDragNDrop>
      <DMButton icon='check' empty className='mt-4'>
        Nah, I'm good
      </DMButton>
    </>
  )
}
