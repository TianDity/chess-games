export function crossMark(x: number, y: number): number[] {
  const markArr: string[][] = [
    ['1-2', '7-2', '0-3', '2-3', '4-3', '6-3', '0-6', '2-6', '4-6', '6-6', '1-7', '7-7'],
    ['0-2', '6-2', '1-3', '3-3', '5-3', '7-3', '1-6', '3-6', '5-6', '7-6', '0-7', '6-7'],
    ['0-1', '6-1', '1-2', '3-2', '5-2', '7-2', '1-5', '3-5', '5-5', '7-5', '0-6', '6-6'],
    ['1-1', '7-1', '0-2', '2-2', '4-2', '6-2', '0-5', '2-5', '4-5', '6-5', '1-6', '7-6'],
  ];

  let result: number[] = [];

  markArr.forEach((mark: string[], idx) => {

    mark.forEach((pos) => {
      const [xPos, yPos] = pos.split('-');
      if (x === Number(xPos) && y === Number(yPos)) {
        result.push(idx);
      }
    });
  })

  return result;
}
