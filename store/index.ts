import { redPieces } from "./redPieces"
import { blackPieces } from "./blackPieces"

interface ChessState {
  id: string;
  type: string;
  color: string;
  status: number;
}

export const initialStore = ((redPieces, blackPieces) => {
  let chessCoord: ChessState[][] = [];

  Array.from({ length: 10 }).forEach((item, y) => {
    chessCoord[y] = [];

    Array.from({ length: 9 }).forEach((item, x) => {
      chessCoord[y].push({
        id: `${x}-${y}`,
        type: '',
        color: '',
        status: 0,
      }); 
    });
  })

  for (let type in redPieces) {
    const posArr = redPieces[type as keyof typeof redPieces];

    posArr.forEach(item => {
      const x = +item.split('-')[0];
      const y = +item.split('-')[1];

      chessCoord[y][x].type = type;
      chessCoord[y][x].color = 'red';
      chessCoord[y][x].status = 1;
    })
  }

  for (let type in blackPieces) {
    const posArr = blackPieces[type as keyof typeof redPieces];

    posArr.forEach(item => {
      const x = +item.split('-')[0];
      const y = +item.split('-')[1];

      chessCoord[y][x].type = type;
      chessCoord[y][x].color = 'black';
      chessCoord[y][x].status = 1;
    })
  }

  return chessCoord;
})(redPieces, blackPieces)
