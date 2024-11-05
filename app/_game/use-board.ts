"use client"
import { useCallback, useEffect } from "react"
import { NB_COLS, NB_ROWS, NB_TILES, useGameStore } from "./game.store"
import { Direction, DIRECTIONS, Tile } from "./game.types"

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

  useEffect(() => {
    spawnTiles()
  }, [spawnTiles])

  /**
   * Handle moves in a row and return the new row and the fusion index
   */
  const handleRowMoves = (
    row: (Tile | null)[],
    reverse: boolean,
    rowSize: number
  ) => {
    const newRow = [...row]
    const start = reverse ? rowSize - 1 : 0
    const end = reverse ? -1 : rowSize
    const step = reverse ? -1 : 1
    let fusionIndex: null | number = null

    for (let i = start; reverse ? i > end : i < end; i += step) {
      const tile = newRow[i]

      if (tile) {
        continue
      }

      // From this tile, find next non empty tile
      for (let j = i + step; reverse ? j > end : j < end; j += step) {
        const nextTile = newRow[j]

        if (nextTile) {
          if (newRow[i - step]?.value === nextTile.value) {
            fusionIndex = i - step
          }

          newRow[i] = nextTile
          newRow[j] = null

          break
        }
      }
    }

    return { updatedRow: newRow, fusionIndex }
  }

  const handleMoveX = useCallback(
    (dir: Direction) => {
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
      /*
    On parcourt chaque ligne. Pour chaque ligne, on parcourt chaque case. Si la valeur de la case est null, on va chercher la prochaine case non null.
    1) Si la valeur est différente, alors la case en cours devinent la case qu'on a trouvée et la case trouvée devient null
    2) Si on a une case à i - 1 et que la valeur de la case trouvée est égale à la valeur de la case -1, alors on indique l'index de la fusion (case - 1)
    Une fois la ligne traitée :
    On met à jour le state board avec les déplacements
    Ensuite, on regarde si il y avait une fusion et si il y en avait une, on fusionne à l'index de la fusion et on déplace toutes les cases d'après d'une case -1.
    */
      const rowsFusions: Record<number, number> = {}
      const updatedRows = [...rows]

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const { updatedRow, fusionIndex } = handleRowMoves(
          row,
          reverse,
          NB_COLS
        )

        updatedRows[i] = updatedRow

        if (fusionIndex !== null) {
          rowsFusions[i] = fusionIndex
        }
      }

      updateBoard(updatedRows.flat())

      // Function to handle fusions
      // TODO + SPAWN TILES
    },
    [board, updateBoard]
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
