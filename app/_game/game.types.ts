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
  score: number
  addScore: (score: number) => void
  reset: () => void
  spawnTiles: (nbTiles: number) => void
  updateBoard: (board: (Tile | null)[]) => void
}
