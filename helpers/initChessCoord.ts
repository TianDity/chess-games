export function initChessCoord() {
  let chessCoord: any[][] = [];

  Array.from({ length: 10 }).forEach((item, y) => {
    chessCoord[y] = [];

    Array.from({ length: 9 }).forEach((item, x) => {
      chessCoord[y].push({
        x: x,
        y: y,
      }); 
    });
  })

  return chessCoord;
}
