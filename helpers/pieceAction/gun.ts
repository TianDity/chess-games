interface DepProps {
  id: number;
  status: number;
  color: string;
  x: number;
  y: number;
}

interface DataProps {
  xDepArr: DepProps[],
  yDepArr: DepProps[],
}

function gunPieceAction(state: any, pos: string) {
  let [x, y] = pos.split('-').map(Number);
  const focusColor = state[y][x].color;

  const init = () => {
    const xDep = xPosDep();
    const yDep = yPosDep();
    const res = moveToPoints(xDep, yDep);
    const depArr = takePiece(res, xDep, yDep);

    return depArr;
  }

  const xPosDep = () => {
    let dep = [];
    for (let i = 0; i <= 8; i++) {
      const xPosColor = state[y][i].color;
      const xPosStatus = state[y][i].status; 
      dep.push({
        id: i,
        status: xPosStatus,
        color: xPosColor,
        x: i,
        y: y,
      });
    }
    return dep;
  }

  const yPosDep = () => {
    let dep = [];
    for (let j = 0; j <= 9; j++) {
      const yPosColor = state[j][x].color;
      const yPosStatus = state[j][x].status;
      dep.push({
        id: j,
        status: yPosStatus,
        color: yPosColor,
        x: x,
        y: j,
      });
    }

    return dep;
  }

  const moveToPoints = (xDep: DepProps[], yDep: DepProps[]) => {
    let rightVal = xDep.find((item) => item.status === 1 && item.x > x),
        leftVal = xDep.reverse().find((item) => item.status === 1 && item.x < x),
        downVal = yDep.find((item) => item.status === 1 && item.y > y),
        upVal = yDep.reverse().find((item) => item.status === 1 && item.y < y);

    const rightPoint = rightVal && rightVal.status === 1 ? rightVal.id : 8;
    const leftPoint = leftVal && leftVal.status === 1 ? leftVal.id : 0;
    const upPoint = upVal && upVal.status === 1 ? upVal.id : 0;
    const downPoint = downVal && downVal.status === 1 ? downVal.id : 9;

    const xDepArr = xDep.filter((item) => item.id >= leftPoint && item.id <= rightPoint && item.status === 0);
    const yDepArr = yDep.filter((item) => item.id >= upPoint && item.id <= downPoint && item.status === 0);

    return {
      xDepArr,
      yDepArr,
    }
  }

  const takePiece = (data: DataProps, xDep: DepProps[], yDep: DepProps[]): string[] => {
    const sortFn = (a: any, b: any) => a.id - b.id;
    const leftPoints = xDep.filter(item => item.x < x && item.status === 1);
    const rightPoints = xDep.filter(item => item.x > x && item.status === 1).sort(sortFn);
    const upPoints = yDep.filter(item => item.y < y && item.status === 1);
    const downPoints = yDep.filter(item => item.y > y && item.status === 1).sort(sortFn);

    const rightPiece = rightPoints[1] && rightPoints[1].color !== focusColor;
    const leftPiece = leftPoints[1] && leftPoints[1].color !== focusColor;
    const upPiece = upPoints[1] && upPoints[1].color !== focusColor;
    const downPiece = downPoints[1] && downPoints[1].color !== focusColor;

    const { xDepArr, yDepArr } = data;

    rightPiece && xDepArr.push(rightPoints[1]);
    leftPiece && xDepArr.push(leftPoints[1]);
    upPiece && yDepArr.push(upPoints[1]);
    downPiece && yDepArr.push(downPoints[1]);

    return [
      ...xDepArr.map(item => {
        return `${item.x}-${item.y}`
      }),
      ...yDepArr.map(item => {
        return `${item.x}-${item.y}`
      })
    ]
  }


  return init();
}

export default gunPieceAction
