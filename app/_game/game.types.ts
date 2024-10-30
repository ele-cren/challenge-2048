export type Direction = "up" | "down" | "left" | "right"

export type GameStoreType = {
  grid: number[]
  move: (dir: Direction) => void
  reset: () => void
  spawnTiles: () => void
}
