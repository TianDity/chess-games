import { createContext, useContext, useReducer } from "react";
import { initialStore } from "./index";

const ChessPiecesContext = createContext<ChessPieceState[][]>([[]]);
const ChessPiecesDispatchContext = createContext<React.Dispatch<ActionType>>(() => undefined);

type ChessPieceState = {
  id: string,
  type: string,
  color: string,
  status: number,
}

type SetActionType = {
  type: 'set_piece',
  oldFocusPiece: any;
  oldTouchPiece: any;
}

type MoveActionType = {
  type: 'move_piece',
  focusId: string,
  touchId: string,
  focusType: string,
  focusColor: string,
}

type ActionType = MoveActionType | SetActionType

export function ChessPiecesProvider({ children }: { children: React.ReactNode }) {
  const [chessPieces, dispatch] = useReducer(chessReducer, initialStore)

  return (
    <ChessPiecesContext.Provider value={chessPieces}>
      <ChessPiecesDispatchContext.Provider value={dispatch}>
        { children }
      </ChessPiecesDispatchContext.Provider>
    </ChessPiecesContext.Provider>
  )
}

export function useChessPieces() {
  const chessPieces = useContext(ChessPiecesContext);
  return chessPieces;
}

export function useChessPiecesDispatch() {
  const dispatch = useContext(ChessPiecesDispatchContext);
  return dispatch;
}

function chessReducer(state: ChessPieceState[][], action: ActionType) {
  switch (action.type) {
    case 'move_piece': {
      const { focusId, touchId, focusType, focusColor } = action;
      const chessCoord: ChessPieceState[][] = state.map((item) => {
        return item.map((piece) => {
          if (piece.id === touchId) {
            return {
              ...piece,
              status: 1,
              type: focusType,
              color: focusColor
            }
          }

          if (piece.id === focusId) {
            return {
              ...piece,
              status: 0,
              type: '',
              color: '',
            }
          }

          return piece;
        })
      })

      return chessCoord; 
    }
    case 'set_piece': {
      const { oldFocusPiece, oldTouchPiece } = action;
      const chessCoord: ChessPieceState[][] = state.map((item) => {
        return item.map((piece) => {
          if (piece.id === oldFocusPiece.id) {
            return {
              ...piece,
              type: oldFocusPiece.type,
              color: oldFocusPiece.color,
              status: oldFocusPiece.status,
            }
          }

          if (piece.id === oldTouchPiece.id) {
            return {
              ...piece,
              type: oldTouchPiece.type,
              color: oldTouchPiece.color,
              status: oldTouchPiece.status,
            }
          }

          return piece;
        })
      })

      return chessCoord; 
    }
    default:
      return state;
  }
}
