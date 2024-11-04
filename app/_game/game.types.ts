export const DIRECTIONS = {
  Up: "up",
  Down: "down",
  Left: "left",
  Right: "right"
} as const

export type Direction = (typeof DIRECTIONS)[keyof typeof DIRECTIONS]

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
