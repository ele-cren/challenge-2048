"use client"
import { v4 as uuidv4 } from "uuid"
import { create } from "zustand"
import { GameStoreType, Tile } from "./game.types"

export const NB_ROWS = 4
export const NB_COLS = 4
export const NB_TILES = NB_ROWS * NB_COLS

const initialBoard = Array(NB_TILES).fill(null)

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
  updateBoard: (board: (Tile | null)[]) => {
    set({ board })
  },
  score: 0,
  addScore: (score: number) => {
    set((state) => ({ score: state.score + score }))
  },
  reset: () => {},
  spawnTiles: (nbTiles: number) => {
    set((state) => {
      return { board: addRandomTiles(state.board, nbTiles) }
    })
  }
}))
