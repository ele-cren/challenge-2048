"use client"
import { useBoard } from "./use-board"

// TODO : To animate, need empty board then tiles on top of it

export const Board = () => {
  const { grid } = useBoard()

  return (
    <div className="grid size-[500px] grid-cols-4 grid-rows-4 gap-2 rounded bg-slate-900 p-4">
      {grid.map((x, i) => {
        return (
          <div
            key={`${x}-${i}`}
            className="flex items-center justify-center rounded bg-slate-100 text-3xl font-bold text-primary"
          >
            {x === 0 ? "" : x}
          </div>
        )
      })}
    </div>
  )
}
