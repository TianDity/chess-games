function pawnPieceAction(state: any, pos: string) {
  let [x, y] = pos.split('-').map(Number);
  const focusColor = state[y][x].color;
  const direc = focusColor === 'black' ? 1 : -1;

  const xStep = [-1, 1];
  const yStep = [0, 0];

  const init = () => {
    const res = moveToPoints();
    const depArr = filterPoints(res);

    return depArr;
  }

  const moveToPoints = () => {
    let res = [];

    if (y + direc <= 9 && y + direc >= 0) {
      res.push({
        x: x,
        y: y + direc,
      })
    }

    if (direc === 1 && y > 4) {
      for (let i = 0; i < 2; i++) {
        x += xStep[i];
        y += yStep[i];
        if (x >= 0 && y >= 0 && x <= 8 && y <= 9) {
          res.push({
            x,
            y
          })
        }

        x -= xStep[i];
        y -= yStep[i];
      }
    }

    if (direc === -1 && y < 5) {
      for (let i = 0; i < 2; i++) {
        x += xStep[i];
        y += yStep[i];
        if (x >= 0 && y >= 0 && x <= 8 && y <= 9) {
          res.push({
            x,
            y
          })
        }

        x -= xStep[i];
        y -= yStep[i];
      }
    }

    return res;
  }

  const filterPoints = (arr: any) => {
    const depArr = arr.filter((item: any) => {
      const { x, y } = item;
      const color = state[y][x].color;
      return color !== focusColor;
    })

    return depArr.map((item: any) => {
      return `${item.x}-${item.y}`;
    })
  }

  return init();
}

export default pawnPieceAction
