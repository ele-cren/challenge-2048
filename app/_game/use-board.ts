"use client"
import { useCallback, useEffect } from "react"
import { NB_COLS, NB_ROWS, NB_TILES, useGameStore } from "./game.store"
import { Direction, DIRECTIONS, Tile } from "./game.types"
import { v4 as uuidv4 } from "uuid"

const USED_KEYS = new Map<string, Direction>([
  ["ArrowUp", "up"],
  ["ArrowDown", "down"],
  ["ArrowLeft", "left"],
  ["ArrowRight", "right"]
])

export const useBoard = () => {
  const board = useGameStore((state) => state.board)
  const spawnTiles = useGameStore((state) => state.spawnTiles)
  const updateBoard = useGameStore((state) => state.updateBoard)
  const addScore = useGameStore((state) => state.addScore)
  useEffect(() => {
    spawnTiles(2)
  }, [spawnTiles])

  const handleFusion = useCallback(
    (row: (Tile | null)[], fusionIndex: number, reverse: boolean) => {
      const newRow = [...row]
      const start = fusionIndex
      const end = reverse ? 0 : row.length - 1
      const step = reverse ? -1 : 1

      if (!newRow[fusionIndex]) {
        return newRow
      }

      const fusionValue = newRow[fusionIndex]?.value * 2

      newRow[fusionIndex] = {
        value: fusionValue,
        id: uuidv4()
      }

      newRow[fusionIndex + step] = null

      for (let i = start; reverse ? i >= end : i <= end; i += step) {
        const tile = newRow[i]

        if (tile) {
          if (
            (reverse ? i - step < start : i - step > start) &&
            !newRow[i - step]
          ) {
            newRow[i - step] = tile
            newRow[i] = null
          }
        }
      }

      addScore(fusionValue)

      return newRow
    },
    [addScore]
  )

  /**
   * Handle moves in a row and return the new row and the fusion index
   */
  const handleRowMoves = (row: (Tile | null)[], reverse: boolean) => {
    const newRow = [...row]
    const start = reverse ? row.length - 1 : 0
    const end = reverse ? 0 : row.length - 1
    const step = reverse ? -1 : 1
    let fusionIndex: null | number = null
    let isMove = false

    for (let i = start; reverse ? i > end : i < end; i += step) {
      const tile = newRow[i]

      // From this tile, find next non empty tile
      for (let j = i + step; reverse ? j >= end : j <= end; j += step) {
        const nextTile = newRow[j]

        if (nextTile) {
          if (!tile) {
            newRow[i] = nextTile
            newRow[j] = null
            isMove = true
          } else if (newRow[i + step] === null) {
            newRow[i + step] = nextTile
            newRow[j] = null
            isMove = true

            if (tile.value === nextTile.value) {
              fusionIndex = i
            }
          } else if (tile.value === nextTile.value && !fusionIndex) {
            fusionIndex = i
          }

          break
        }
      }
    }

    return { updatedRow: newRow, fusionIndex, isMove }
  }

  const handleMoveX = useCallback(
    async (dir: Direction) => {
      if (board?.length !== NB_TILES) {
        return board
      }

      const rows = []

      for (let i = 0; i < NB_ROWS; i++) {
        const start = i * NB_COLS
        const end = start + NB_COLS

        rows.push(board.slice(start, end))
      }

      const reverse = dir === DIRECTIONS.Right
      const rowsFusions: Record<number, number> = {}
      const updatedRows = [...rows]
      let hasBoardChanged = false

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const { updatedRow, fusionIndex, isMove } = handleRowMoves(row, reverse)
        hasBoardChanged = hasBoardChanged || isMove || fusionIndex !== null

        updatedRows[i] = updatedRow

        if (fusionIndex !== null) {
          rowsFusions[i] = fusionIndex
        }
      }

      updateBoard(updatedRows.flat())

      if (Object.keys(rowsFusions).length > 0) {
        const fusionUpdatedRows = [...updatedRows]

        for (const rowIndex in rowsFusions) {
          const row = updatedRows[rowIndex]
          const fusionIndex = rowsFusions[rowIndex]

          fusionUpdatedRows[rowIndex] = handleFusion(row, fusionIndex, reverse)
        }

        await new Promise((resolve) => setTimeout(resolve, 200))

        updateBoard(fusionUpdatedRows.flat())
      }

      if (hasBoardChanged) {
        setTimeout(() => {
          spawnTiles(1)
        }, 200)
      }
    },
    [board, updateBoard, handleFusion, spawnTiles]
  )

  const handleMove = useCallback(
    (dir: Direction) => {
      if (dir === DIRECTIONS.Right || dir === DIRECTIONS.Left) {
        handleMoveX(dir)
      }
    },
    [handleMoveX]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (USED_KEYS.has(e.key)) {
        handleMove(USED_KEYS.get(e.key) as Direction)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleMove])

  return { board }
}
