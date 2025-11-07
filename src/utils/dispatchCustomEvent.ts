import type { CustomEventName } from '@types'

export const dispatchCustomEvent = (name: CustomEventName, detail?: unknown) => {
  document.dispatchEvent(new CustomEvent(name, { detail }))
}
