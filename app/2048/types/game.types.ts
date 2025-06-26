// app/2048/types/game.types.ts
export interface Tile {
    value: number;
    id: string;
    merged?: boolean;
  }
  
  export type Direction = 'up' | 'down' | 'left' | 'right';