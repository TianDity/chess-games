function queenPieceAction(state: any, pos: string) {
  const x = +pos.split('-')[0];
  const y = +pos.split('-')[1];
  const focusColor = state[y][x].color;

  let xOrigin = 3,
      yOrigin = focusColor === 'black' ? 0 : 7;

  const xStep = [0, 2, 0, 1, 2];
  const yStep = [0, 0, 2, 1, 2];

  const init = () => {
    const res = initialPos();
    const depArr = filterPosArr(res);

    return depArr;
  }

  const initialPos = () => {
    let res = [];
    for (let i = 0; i < 5; i++) {
      xOrigin += xStep[i];
      yOrigin += yStep[i];
      const xMinusAbs = Math.abs(x - xOrigin);
      const yMinusAbs = Math.abs(y - yOrigin);
      if (xMinusAbs < 2 && yMinusAbs < 2) {
        res.push({
          x: xOrigin,
          y: yOrigin
        })
      }

      xOrigin = 3,
      yOrigin = focusColor === 'black' ? 0 : 7;
    }

    return res;
  }

  const filterPosArr = (arr: any[]): string[] => {
    let depArr: any[] = [];
    arr.forEach(item => {
      const { x, y } = item;
      if (state[y][x].status === 0 || state[y][x].color !== focusColor) {
        depArr.push(`${x}-${y}`);
      }
    })

    return depArr;
  }

  return init();
}

export default queenPieceAction
