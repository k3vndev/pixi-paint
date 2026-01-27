import { CLICK_BUTTON } from '@/consts'
import { clickIncludes } from '@/utils/clickIncludes'
import { useEvent } from './useEvent'

/**
 * Hook that prevents default browser behaviors for specific events.
 *
 * Prevents:
 * - Drag start events on the window
 * - Context menu events on the window
 * - Middle mouse button clicks
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useDefaultPrevention()
 *   // Component will have default prevention applied
 * }
 * ```
 */
export const useDefaultPrevention = () => {
  const preventDefault = (e: Event) => {
    e.preventDefault()
  }

  useEvent('dragstart', preventDefault, { target: 'window' })

  useEvent('contextmenu', preventDefault, { target: 'window' })

  useEvent('mousedown', (e: MouseEvent) => {
    if (clickIncludes(e.button, CLICK_BUTTON.MIDDLE)) e.preventDefault()
  })
}
