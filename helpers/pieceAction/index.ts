import bishopPieceAction from "./bishop";
import carPieceAction from "./car";
import gunPieceAction from "./gun";
import horsePieceAction from "./horse";
import kingPieceAction from "./king";
import pawnPieceAction from "./pawn";
import queenPieceAction from "./queen";


const actionObj = {
  bishop: bishopPieceAction,
  car: carPieceAction,
  gun: gunPieceAction,
  horse: horsePieceAction,
  king: kingPieceAction,
  pawn: pawnPieceAction,
  queen: queenPieceAction,
}

/**
 * 
 * @param state ]
 * @param payload 
 * focusPiece
 * 
 * touchPiece 
 */

export function handlePieceAction(state: any[][], payload: any) {
  const { focusId, touchId } = payload;
  const [xFocus, yFocus] = focusId.split('-').map(Number);
  const [xTouch, yTouch] = touchId.split('-').map(Number);
  const focusPiece = state[yFocus][xFocus];
  const touchPiece = state[yTouch][xTouch];
  let res = false;
  const focusType = focusPiece.type;

  const depArr = focusType && actionObj[focusType as keyof typeof actionObj](state, focusPiece.id);

  if (depArr.includes(touchPiece.id)) {
    res = true;
  }

  return res;
}
