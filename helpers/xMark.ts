export function xMark(x: number, y: number): number | null {
  const markArr: string[][] = [
    ['3-0', '4-1', '3-7', '4-8'],
    ['4-0', '3-1', '4-7', '3-8'],
  ]

  let result = null;

  markArr.forEach((mark: string[], idx) => {
      mark.forEach((pos) => {
        const [xPos, yPos] = pos.split('-');
        if (x === Number(xPos) && y === Number(yPos)) {
          result = idx;
        }
      })
  })

  return result;
}
