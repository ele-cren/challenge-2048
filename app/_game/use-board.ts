"use client"
import { useEffect } from "react"
import { Direction } from "./game.types"
import { useGameStore } from "./game.store"

const USED_KEYS = new Map<string, Direction>([
  ["ArrowUp", "up"],
  ["ArrowDown", "down"],
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"]
])

export const useBoard = () => {
  const board = useGameStore((state) => state.board)
  const move = useGameStore((state) => state.move)
  const spawnTiles = useGameStore((state) => state.spawnTiles)

  useEffect(() => {
    spawnTiles()
  }, [spawnTiles])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (USED_KEYS.has(e.key)) {
        move(USED_KEYS.get(e.key) as Direction)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [move])

  return { board }
}
