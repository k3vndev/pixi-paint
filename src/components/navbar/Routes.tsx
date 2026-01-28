import { CLICK_BUTTON, ROUTES } from '@consts'
import type { ContextMenuOption, IconName } from '@types'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useRef } from 'react'
import { useContextMenu } from '@/hooks/useContextMenu'
import { useResponsiveness } from '@/hooks/useResponsiveness'
import { RouteTile } from './RouteTile'

export const Routes = () => {
  const { media, loaded } = useResponsiveness()
  const ctxMenuRef = useRef<HTMLElement>(null)
  const pathName = usePathname()
  const router = useRouter()

  const routes: RouteType[] = useMemo(
    () =>
      ROUTES.map(({ icon, name }) => {
        const path = `/${name.replace(' ', '').toLowerCase()}`
        return { path, name, icon }
      }),
    []
  )

  const [selectedRoute, ctxMenuOptions] = useMemo(() => {
    let selectedRoute: RouteType | null = null
    const ctxMenuOptions: ContextMenuOption[] = []

    for (const route of routes) {
      if (route.path === pathName) {
        selectedRoute = route
        continue
      }
      ctxMenuOptions.push({
        label: route.name,
        icon: route.icon,
        action: () => router.push(route.path)
      })
    }

    return [selectedRoute, ctxMenuOptions]
  }, [pathName])

  useContextMenu({
    ref: ctxMenuRef,
    options: ctxMenuOptions,
    allowedClicks: [CLICK_BUTTON.LEFT, CLICK_BUTTON.RIGHT],
    showWhen: !media.lg
  })

  if (!loaded) {
    return null
  }

  return (
    <>
      {/* 404 Route */}
      {!selectedRoute && <RouteTile icon='cross' name='Not found' isSelected index={0} />}

      {/* Desktop Router */}
      {media.lg ? (
        routes.map((route, i) => (
          <RouteTile key={route.path} {...route} isSelected={selectedRoute?.path === route.path} index={i} />
        ))
      ) : (
        <>
          {/* Mobile Router */}
          {selectedRoute && <RouteTile {...selectedRoute} isSelected index={0} />}
          <RouteTile ref={ctxMenuRef} name='...' index={1} />
        </>
      )}
    </>
  )
}

interface RouteType {
  path: string
  name: string
  icon: IconName
}
