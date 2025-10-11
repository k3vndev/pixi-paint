'use client'

import { CURSORS, SPRITES_SIZE, TOOLS } from '@consts'
import type { ToolbarTool as ToolbarToolType } from '@types'
import { twMerge } from 'tailwind-merge'
import { usePaintWorkspaceContext } from '@/context/PaintWorkspaceContext'
import { ToolbarContext } from '@/context/ToolbarContext'
import { useResponsiveness } from '@/hooks/useResponsiveness'
import { Separator } from './Separator'
import { Tool } from './Tool'

interface Props {
  extraItem?: React.ReactNode
}

export const ToolBar = ({ extraItem }: Props) => {
  const { elementStyle } = usePaintWorkspaceContext()

  const { media, loaded } = useResponsiveness()
  const spriteSize = media.lg ? SPRITES_SIZE : media.md ? 72 : media.sm ? 64 : 56

  const tools: ToolbarToolType[] = [
    {
      cursor: CURSORS[1],
      tool: TOOLS.BRUSH,
      shortcut: 'B'
    },
    {
      cursor: CURSORS[2],
      tool: TOOLS.BUCKET,
      shortcut: 'G'
    },
    {
      cursor: CURSORS[3],
      tool: TOOLS.ERASER,
      shortcut: 'E'
    },
    {
      cursor: CURSORS[4],
      tool: TOOLS.COLOR_PICKER,
      shortcut: 'I'
    }
  ]

  if (!loaded) return null

  return (
    <ToolbarContext.Provider value={{ spriteSize }}>
      <aside
        className={twMerge(`
          absolute lg:gap-3 sm:gap-2 gap-1.5 
          lg:left-[var(--sidebar-margin)] not-lg:bottom-[var(--sidebar-margin)]
          flex lg:flex-col justify-center lg:w-fit w-[var(--w-screen-minus-pad)]
          animate-slide-in-left ${elementStyle}
        `)}
      >
        {tools.map(tool => (
          <Tool {...tool} key={tool.tool} spriteSize={spriteSize} />
        ))}

        {!!extraItem && (
          <>
            {media.lg && <Separator />}
            {extraItem}
          </>
        )}
      </aside>
    </ToolbarContext.Provider>
  )
}
