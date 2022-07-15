interface DepProps {
  id: number;
  status: number;
  color: string;
  x: number;
  y: number;
}

function carPieceAction(state: any, pos: string) {
  let x = +pos.split('-')[0],
      y = +pos.split('-')[1];
  const focusColor = state[y][x].color;

  const init = () => {
    const xDep = xPosDep();
    const yDep = yPosDep();
    const res = moveToPoints(xDep, yDep);

    return res;
  }

  const xPosDep = () => {
    let dep = [];
    for (let i = 0; i <= 8; i++) {
      let xPosColor = state[y][i].color,
          xPosStatus = state[y][i].status;
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
      let yPosColor = state[j][x].color,
          yPosStatus = state[j][x].status;
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

    const xDepArr = xDep.filter((item) => item.id >= leftPoint && item.id <= rightPoint && item.color !== focusColor && item.x !== x);
    const yDepArr = yDep.filter((item) => item.id >= upPoint && item.id <= downPoint && item.color !== focusColor && item.y !== y);

    return [
      ...xDepArr.map(item => {
        return `${item.x}-${item.y}`
      }),
      ...yDepArr.map(item => {
        return `${item.x}-${item.y}`
      })
    ]
  }

  return init()
}


export default carPieceAction;
