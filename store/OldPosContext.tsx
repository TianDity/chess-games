import React, { createContext, useReducer, useContext } from "react";

const OldPosContext = createContext<{
  oldPos: StateType,
  dispatch: React.Dispatch<ActionType>
}>({
  oldPos: {
    oldFocusId: '',
    oldTouchId: '',
    oldTouchType: '',
  },
  dispatch: () => undefined,
});

type StateType = {
  oldFocusId: string;
  oldTouchId: string;
  oldTouchType: string;
}

type FocusActionType = {
  type: 'add_focus',
  oldFocusId: string,
}

type TouchActionType = {
  type: 'add_touch',
  oldTouchId: string,
  oldTouchType: string
}

type ResetActionType = {
  type: 'reset_pos',
}

type ActionType = FocusActionType | TouchActionType | ResetActionType

const initialOldPos = {
  oldFocusId: '',
  oldTouchId: '',
  oldTouchType: '',
}

export function OldPosProvider({ children }: { children: React.ReactNode }) {
  const [oldPos, dispatch] = useReducer(
    oldPosReducer,
    initialOldPos,
  )

  return (
    <OldPosContext.Provider value={{ oldPos, dispatch }}>
      {children}
    </OldPosContext.Provider>
  )
}

export function useOldPos() {
  const { oldPos } =  useContext(OldPosContext);
  return oldPos;
}

export function useOldPosDispatch() {
  const { dispatch } = useContext(OldPosContext);
  return dispatch;
}

function oldPosReducer(state: StateType, action: ActionType) {
  switch (action.type) {
    case 'add_focus': {
      return {
        ...state,
        oldFocusId: action.oldFocusId,
      }
    }
    case 'add_touch': {
      return {
        ...state,
        oldTouchId: action.oldTouchId,
        oldTouchType: action.oldTouchType,
      }
    }
    case 'reset_pos': {
      return {
        ...state,
        oldFocusId: '',
        oldTouchId: '',
        oldTouchType: '',
      }
    }
    default:
      return state;
  }
}
