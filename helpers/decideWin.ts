export function decideWin(state: any, options: any) {
  const { focusId, touchId } = options;
  const [xFocus, yFocus] = focusId.split('-').map(Number);
  const [xTouch, yTouch] = touchId.split('-').map(Number);
  const focusPiece = state[yFocus][xFocus];
  const touchPiece = state[yTouch][xTouch];

  if (touchPiece.type === 'king') {
    return focusPiece.color;
  }

  const redKing = state.flat().filter((item: any) => item.type === 'king' && item.color === 'red')[0];
  const blackKing = state.flat().filter((item: any) => item.type === 'king' && item.color === 'black')[0];

  const xRed = +redKing?.id.split('-')[0];
  const xBlack = +blackKing?.id.split('-')[0];

  if (xRed === xBlack && xFocus === xRed && xTouch !== xRed) {
    const filterPiece = state.flat().filter((item: any) => {
      const [x, y] = item.id.split('-').map(Number);

      return x === xRed && item.status === 1;
    })

    if (filterPiece.length === 3) {
      return focusPiece.color === 'red' ? 'black' : 'red';
    }
  }

  if (Math.abs(xRed - xBlack) === 1 && xTouch === xRed || xTouch === xBlack) {
    const filterPiece = state.flat().filter((item: any) => {
      const [x, y] = item.id.split('-').map(Number);

      return x === xTouch && item.status === 1;
    });

    if (filterPiece.length === 1) {
      return touchPiece.color === 'red' ? 'black' : 'red';
    }
  }

  return 'playing';
}
