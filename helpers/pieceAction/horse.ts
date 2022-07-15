
function horsePieceAction(state: any, pos: string) {
  let [x, y] = pos.split('-').map(Number);
  const focusColor = state[y][x].color;

  const xStep = [-2, -1, 1, 2, -2, -1, 1, 2];
  const yStep = [1, 2, 2, 1, -1, -2, -2, -1];
  
  const init = () => {
    const res = initialPos();
    const depArr = filterPosArr(res);

    return depArr;
  }

  const initialPos = () => {
    let res = [];
    for (let i = 0; i < 8; i++) {
      const xPos = x + xStep[i];
      const yPos = y + yStep[i];
      if (xPos >= 0 && xPos <= 8 && yPos >= 0 && yPos <= 9) {
        res.push({
          id: i,
          x: xPos,
          y: yPos,
        });
      }
    }
    
    return res;
  }

  const filterPosArr = (arr: any[]) => {
    let depArr: any[] = [];
    arr.forEach((item) => {
      const { x, y } = item;
      if (state[y][x].status === 0 || state[y][x].color !== focusColor) {
        depArr.push(item);
      }
    });

    const res = handleSidePiece(depArr);
    return res;
  }

  const handleSidePiece = (arr: any[]): string[] => {
    const xStep = [1, -1, 0, 0];
    const yStep = [0, 0, 1, -1];
    let res: any[] = arr;

    for (let i = 0; i < 4; i++) {
      const xPos = x + xStep[i];
      const yPos = y + yStep[i];
      if (xPos >= 0 && xPos <= 8 && yPos >= 0 && yPos <= 9) {

        if (state[yPos][xPos].status === 1 && xPos === x) {
          const val = yPos > y ? yPos + 1 : yPos - 1;
          res = res.filter((item) => item.y !== val);
        }

        if (state[yPos][xPos].status === 1 && yPos === y) {
          const val = xPos > x ? xPos + 1 : xPos - 1;
          res = res.filter((item) => item.x !== val);
        }
      }
    }

    const result = res.map(item => {
      return `${item.x}-${item.y}`
    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                

    return result;
  }

  return init();
}


export default horsePieceAction;
