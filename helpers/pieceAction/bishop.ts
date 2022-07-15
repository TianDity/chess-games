function bishopPieceAction(state: any, pos: string) {
  let x = +pos.split('-')[0],
      y = +pos.split('-')[1];
  const focusColor = state[y][x].color;
  const yMin = focusColor === 'black' ? 0 : 5;
  const yMax = focusColor === 'black' ? 4 : 9;

  const xStep = [-2, 2, 2, -2];
  const yStep = [-2, 2, -2, 2];

  const init = () => {
    const res = initialPos();
    const depArr = filterPosArr(res);

    return depArr;
  }

  const initialPos = () => {
    let res = [];
    for (let i = 0; i < 4; i++) {
      const xPos = x + xStep[i];
      const yPos = y + yStep[i];
      if (xPos >= 0 && xPos <= 8 && yPos >= yMin && yPos <= yMax) {
        res.push({
          id: i,
          x: xPos,
          y: yPos,
        }); 
      }
    }

    return res;
  }

  const filterPosArr = (arr: any[]): string[] => {
    let depArr: any[] = [];
    arr.forEach((item) => {
      const { x, y } = item;
      if (state[y][x].status === 0 || state[y][x].color !== focusColor) {
        depArr.push(`${x}-${y}`);
      }
    });
    return depArr;
  }

  return init();
}

export default bishopPieceAction;
