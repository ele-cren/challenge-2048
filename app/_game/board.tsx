"use client"

import clsx from "clsx"
import { useBoard } from "./use-board"

// TODO : To animate, need empty board then tiles on top of it

export const Board = () => {
  const { board } = useBoard()

  return (
    <div className="grid size-[500px] grid-cols-4 grid-rows-4 gap-2 rounded bg-slate-900 p-4">
      {board.map((tile, index) => {
        return (
          <div
            key={tile?.id ? `tile-${tile?.id}` : `empty-${index}`}
            className={clsx(
              "flex items-center justify-center rounded text-3xl font-bold text-primary",
              {
                "bg-slate-100/10": !tile,
                "bg-slate-100": tile?.id
              }
            )}
          >
            {tile ? tile?.value : null}
          </div>
        )
      })}
    </div>
  )
}
