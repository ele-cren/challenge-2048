"use client"
import { create } from "zustand"
import { Direction, GameStoreType } from "./game.types"

const initialGrid = Array(16).fill(0)

const addRandomTilesToGrid = (grid: number[], nbTiles: number) => {
  let newGrid = [...grid]

  for (let i = 0; i < nbTiles; i++) {
    const tileToSpawn = Math.random() < 0.9 ? 2 : 4
    const emptyCells = newGrid
      .map((cell, index) => (cell === 0 ? index : null))
      .filter(Boolean) as number[]
    const randomCells = emptyCells.sort(() => Math.random() - 0.5).slice(0, 1)
    newGrid = newGrid.map((cell, index) =>
      randomCells.includes(index) ? tileToSpawn : cell
    )
  }

  return newGrid
}

export const useGameStore = create<GameStoreType>((set) => ({
  grid: initialGrid,
  move: (dir: Direction) => {
    console.log(dir)
  },
  reset: () => set(() => ({ grid: initialGrid })),
  spawnTiles: () => {
    set((state) => {
      return { grid: addRandomTilesToGrid(state.grid, 2) }
    })
  }
}))
