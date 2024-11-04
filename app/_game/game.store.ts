"use client"
import { create } from "zustand"
import { Direction, DIRECTIONS, GameStoreType, Tile } from "./game.types"
import { v4 as uuidv4 } from "uuid"

const NB_ROWS = 4
const NB_COLS = 4
const NB_TILES = NB_ROWS * NB_COLS

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

const moveRow = (row: (Tile | null)[], reverse = false) => {
  console.log("Row", row)
  const start = reverse ? row.length - 1 : 0
  const end = reverse ? 0 : row.length - 1
  const step = reverse ? -1 : 1

  /* ALGORITHME
  On parcourt la ligne cellule par cellule
  Si on trouve une cellule remplie, on regarde la cellule d'avant. Bien vérifier que l'index de la cellue d'avant est > start
  Si la cellule d'avant n'est pas remplie, on déplace la cellule à -1 et on rappelle moveRow avec la ligne modifiée
  Si la cellule d'avant est remplie, on regarde si c'est la même valeur. Si c'est la même valeur, alors fusion et on rappelle moveRow avec la ligne modifiée
  */
  for (let i = start; reverse ? i >= end : i <= end; i += step) {
    const tile = row[i]
    console.log("Tile", tile)

    console.log("i - step", i - step)

    // First iteration, no move
    if ((!reverse && i - step < start) || (reverse && i - step > start)) {
      continue
    }

    if (tile?.value && row[i - step] === null) {
      row[i - step] = { ...tile }
      row[i] = null

      return moveRow(row, reverse)
    }

    if (tile?.value && row[i - step]?.value === tile.value) {
      row[i] = null
      row[i - step] = {
        value: tile.value * 2,
        id: uuidv4()
      }
      return moveRow(row, reverse)
    }
  }

  return row
}

const moveX = (board: (Tile | null)[], dir: Direction) => {
  if (board?.length !== 16) {
    return board
  }

  const lines = []

  for (let i = 0; i < NB_ROWS; i++) {
    const start = i * NB_COLS
    const end = start + NB_COLS

    lines.push(board.slice(start, end))
  }

  const reverse = dir === DIRECTIONS.Right

  for (let line of lines) {
    line = moveRow(line, reverse)
  }

  return lines.flat()
}

export const useGameStore = create<GameStoreType>((set) => ({
  board: initialBoard,
  move: (dir: Direction) => {
    set((state) => {
      let currentBoard = [...state.board]

      if (dir === DIRECTIONS.Right || dir === DIRECTIONS.Left) {
        currentBoard = moveX(currentBoard, dir)
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
