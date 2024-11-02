"use client"
import { create } from "zustand"
import { Direction, GameStoreType, Tile } from "./game.types"
import { v4 as uuidv4 } from "uuid"

const initialBoard = Array(16).fill(null)

const addRandomTiles = (board: (Tile | null)[], nbTiles: number) => {
  const newBoard = [...board]
  const hasEmptyCells = newBoard.some((tile) => tile === null)

  if (!hasEmptyCells) {
    return newBoard
  }

  for (let i = 0; i < nbTiles; i++) {
    const tileValue = Math.random() < 0.9 ? 2 : 4
    const emptyCells = newBoard
      .map((tile, index) => (tile === null ? index : null))
      .filter(Boolean) as number[]
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
    const tileToCreate = {
      value: tileValue,
      id: uuidv4()
    }

    newBoard[randomCell] = tileToCreate
  }

  return newBoard
}

export const useGameStore = create<GameStoreType>((set) => ({
  board: initialBoard,
  move: (dir: Direction) => {
    console.log(dir)
    set((state) => {
      const currentBoard = [...state.board]

      for (let i = 0; i < currentBoard.length; i++) {
        const tile = currentBoard[i]

        if (tile && i - 1 >= 0 && !currentBoard[i - 1]) {
          currentBoard[i - 1] = tile
          currentBoard[i] = null
        }
      }

      return { board: currentBoard }
    })
  },
  reset: () => {},
  spawnTiles: () => {
    set((state) => {
      return { board: addRandomTiles(state.board, 2) }
    })
  }
}))
