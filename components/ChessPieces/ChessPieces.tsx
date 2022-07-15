import { jsx, css } from '@emotion/react'
import { Grid, GridItem } from '@chakra-ui/react'
import Image from 'next/image';
import useThrottleFn from '../../hooks/useThrottleFn'
import { useChessPieces, useChessPiecesDispatch } from '../../store/ChessPiecesContext';
import { useEffect, useState } from 'react';
import { handlePieceAction } from "../../helpers/pieceAction"
import { decideWin } from "../../helpers/decideWin"
import { useOldPosDispatch } from '../../store/OldPosContext';
import { roomIdAtom } from '../../pages/chess'
import { useAtom } from 'jotai'

interface Props {
  cellWidth: number;
  player: string;
  curPlayer: string;
  socket: any;
  recover: boolean;
  oldFocusPiece: any;
  oldTouchPiece: any;
  handleSetCurPlayer: any;
  handleSetWinPlayer: any;
  handleSetRecover: any;
  handleSetTriggerRecover: any;
  handleSetConvert: any;
  handleSetOldFocusPiece: any;
  handleSetOldTouchPiece: any;
}

function ChessPieces({
    cellWidth,
    player,
    curPlayer,
    socket,
    recover,
    oldFocusPiece,
    oldTouchPiece,
    handleSetCurPlayer,
    handleSetWinPlayer,
    handleSetRecover,
    handleSetTriggerRecover,
    handleSetConvert,
    handleSetOldFocusPiece,
    handleSetOldTouchPiece
}: Props) {
  const chessPieces = useChessPieces()
  const chessPiecesDispatch = useChessPiecesDispatch()
  const oldPosDispatch = useOldPosDispatch()
  const [roomName, setRoomName] = useAtom(roomIdAtom)
  const [focus, setFocus] = useState(false)
  const curPlayerStr = curPlayer === 'red' ? 'black' : 'red'
  const [focusPos, setFocusPos] = useState({
    x: '',
    y: '',
    type: '',
    color: ''
  })
  
  function handlePieceClick(e: any) {
    const id = e.target.getAttribute('data-id')
    const [x, y] = id.split('-').map(Number)
    const touchPiece = chessPieces[y][x]
    const focusId = `${focusPos.x}-${focusPos.y}`

    if (!focus && touchPiece.status === 1 && curPlayer === player) {
      if (touchPiece.color !== curPlayer) return;
      setFocusPos({
        x: x,
        y: y,
        type: touchPiece.type,
        color: touchPiece.color,
      })
      oldPosDispatch({
        type: 'add_focus',
        oldFocusId: id,
      })
      socket.emit('focus-change', {
        roomName: roomName,
        focus: true,
        x: x,
        y: y,
        type: touchPiece.type,
        color: touchPiece.color,
      })
      setFocus(true)
    }

    if (focus && focusId === touchPiece.id) {
      setFocusPos({
        x: '',
        y: '',
        type: '',
        color: '',
      })
      socket.emit('focus-change', {
        roomName: roomName,
        focus: false,
        x: '',
        y: '',
        type: '',
        color: '',
      })
      setFocus(false)
    }

    if (focus && focusId !== touchPiece.id && player === curPlayer) {
      const res = handlePieceAction(chessPieces, {
        focusId,
        touchId: id,
      })
  
      oldPosDispatch({
        type: 'add_touch',
        oldTouchId: touchPiece.id,
        oldTouchType: touchPiece.type,
      })
  
      if (res) {
        chessPiecesDispatch({
          type: 'move_piece',
          focusId,
          touchId: id,
          focusType: focusPos.type,
          focusColor: focusPos.color,
        })
        socket.emit('pieces-change', {
          roomName: roomName,
          curPlayer: curPlayerStr,
          focusId,
          touchId: id,
          focusType: focusPos.type,
          focusColor: focusPos.color,          
        })
        setFocusPos({
          x: '',
          y: '',
          type: '',
          color: '',
        })
        setFocus(false)
        handleSetCurPlayer(curPlayerStr)
        handleSetConvert(true)
        const winPlayer = decideWin(chessPieces, {
          focusId,
          touchId: id,
        })
        if (winPlayer !== 'playing') {
          handleSetWinPlayer(winPlayer)
          socket.emit('winplayer-change', {
            roomName: roomName,
            winPlayer: winPlayer,             
          })
        }
      }
    }
  }

  const { run } = useThrottleFn(
    (e) => handlePieceClick(e),
    { wait: 500 }
  )

  const initialSocket = async () => {
    socket.on('update-pieces', (msg: any) => {
      chessPiecesDispatch({
        type: 'move_piece',
        focusId: msg.focusId,
        touchId: msg.touchId,
        focusType: msg.focusType,
        focusColor: msg.focusColor,
      })
      handleSetCurPlayer(msg.curPlayer)
      handleSetConvert(true)
      setFocus(false)
      setFocusPos({
        x: '',
        y: '',
        type: '',
        color: '',
      })
    })

    socket.on('update-focus', (msg: any) => {
      setFocusPos({
        x: msg.x,
        y: msg.y,
        type: msg.type,
        color: msg.color,
      })
      setFocus(msg.focus)
    })

    socket.on('update-winplayer', (msg: any) => {
      handleSetWinPlayer(msg.winPlayer)
    })

    socket.on('update-recover', (msg: any) => {
      chessPiecesDispatch({
        type: 'set_piece',
        oldFocusPiece: msg.oldFocusPiece,
        oldTouchPiece: msg.oldTouchPiece,
      })
      handleSetRecover(false)
      handleSetTriggerRecover(false)
      handleSetConvert(true)
      handleSetCurPlayer(msg.curPlayer)
      oldPosDispatch({
        type: 'reset_pos'
      })
    })
  }

  useEffect(() => {
    if (socket) {
      initialSocket()
    }
  }, [socket])

  useEffect(() => {
    if (recover) {
      socket.emit('recover-change', {
        oldFocusPiece,
        oldTouchPiece,
        roomName,
        curPlayer: curPlayerStr,
      })
      handleSetRecover(false)
      handleSetTriggerRecover(false)
      handleSetConvert(true)
      handleSetCurPlayer(curPlayerStr)
      oldPosDispatch({
        type: 'reset_pos'
      })
    }
  }, [recover])

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    }}>
      <Grid
        templateColumns="repeat(9, 1fr)"
        templateRows="repeat(10, 1fr)"
        onClick={run}
      >
        {
          chessPieces.flat().map((item: any) => {
            const [x, y] = item.id.split('-');
            let imgSrc = '';

            if (!item.type || !item.color) {
              imgSrc = '/img/empty.png' 
            } else {
              imgSrc = `/img/${item.type}_${item.color}.png`
            }

            return (
              <GridItem
                key={item.id}
                h={`${cellWidth}px`}
                css={ focus ? chess_pieces(focusPos.x, focusPos.y) : '' }
                data-id={`${x}-${y}`}
              >
                <Image
                  src={imgSrc}
                  width={cellWidth}
                  height={cellWidth}
                  data-id={`${x}-${y}`}
                />
              </GridItem>
            )
          })
        }
      </Grid>
    </div>
  );
}

export default ChessPieces;


/* style start */
const chess_pieces = (x: string, y: string) =>
  css`
    &[data-id="${x}-${y}"] {
      background: center / contain no-repeat url("/img/chess_bg.png");
    }
  `
/* style end */
