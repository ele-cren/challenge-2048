export type Direction = "up" | "down" | "left" | "right"

export type Tile = {
  value: number
  id: string
}

export type GameStoreType = {
  board: (Tile | null)[]
  move: (dir: Direction) => void
  reset: () => void
  spawnTiles: () => void
}
