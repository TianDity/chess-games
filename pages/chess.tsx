import type { NextPage } from 'next'
import ChessBoard from '../components/ChessBoard'
import useWindowSize from '../hooks/useWindowSize'
import ChessPieces from '../components/ChessPieces'
import Gamer from '../components/Gamer'
import { useState, useEffect, useRef } from 'react'
import { Flex, Box } from '@chakra-ui/react'
import ModalWin from '../components/ModalWin'
import ModalPlayer from '../components/ModalPlayer'
import { ChessPiecesProvider } from '../store/ChessPiecesContext'
import { OldPosProvider } from '../store/OldPosContext'
import { nanoid } from 'nanoid'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'
import { useRouter } from 'next/router'
import { useChessPiecesDispatch } from '../store/ChessPiecesContext';
import ModalRecover from '../components/ModalRecover'
import io from 'socket.io-client'
let socket: any

const nanoId = nanoid(8)
export const roomIdAtom = atomWithStorage('roomId', nanoId)

interface Props {
  queryId?: string | string[];
}

const Chess: NextPage<Props> = ({ queryId }) => {
  const clientRef = useRef<HTMLDivElement>(null)
  const { width, height } = useWindowSize()
  const [cellWidth, setCellWidth] = useState(width / 9)
  const [winPlayer, setWinPlayer] = useState('')
  const [player, setPlayer] = useState('')
  const [curPlayer, setCurPlayer] = useState('red')
  const [convert, setConvert] = useState(false)
  const [initCountDown, setInitCountDown] = useState(false)
  const [visitorId, setVisitorId] = useState('')
  const [identify, setIdentify] = useState('visitor')
  const [room, setRoom] = useState<string[] | null>(null)
  const [init, setInit] = useState(false)
  const [extendedResult, updateExtendedResult] = useState(false)
  const { data, getData } = useVisitorData({ extendedResult }, { immediate: true })
  const [restart, setRestart] = useState(false)
  const [roomName, setRoomName] = useAtom(roomIdAtom)
  const triggerWin = winPlayer ? winPlayer !== 'playing' : false
  const winPlayerText = winPlayer === 'red' ? '红方获得胜利' : '黑方获得胜利'
  const triggerPlayer = identify === 'organiger' ? true : false
  const isDisabled = identify === 'invitee' ? true : false
  const [recover, setRecover] = useState(false)
  const [triggerRecover, setTriggerRecover] = useState(false)
  const [oldTouchPiece, setOldTouchPiece] = useState({
    id: '',
    type: '',
    color: '',
    status: 0,
  })
  const [oldFocusPiece, setOldFocusPiece] = useState({
    id: '',
    type: '',
    color: '',
    status: 1,
  })

  const chessPiecesDispatch = useChessPiecesDispatch()
  const router = useRouter()

  const reloadData = () => {
    getData({ ignoreCache: true })
  }

  const addRoomVisitor = () => {
    fetch('/api/roomName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'add_room_item',
        visitorId: visitorId,
        roomName,
      }),
    })
    .then(res => res.json())
    .then(val => {
      console.log('addRoomVisitor:', val)
    })
  }

  const removeRoom = () => {
    fetch('/api/roomName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'remove_room',
        roomName,
      }),
    })
    .then(res => res.json())
    .then(val => {
      console.log('removeRoom:', val)
    })
  }

  const getRoomVisitors = () => {
    fetch('/api/roomName', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'get_room_items',
        visitorId: visitorId,
        roomName,
      }),
    })
    .then(res => res.json())
    .then(val => {
      console.log('getRoomVisitors:', val)
      setRoom(val.data)
    })
  }
  
  const socketInitializer = async () => {
    await fetch('/api/socket')
    socket = io()

    socket.on('connect', () => {
      console.log("socket已连接")
      socket.emit('joinRoom', {
        roomName: roomName,
      })
    })

    socket.on('update-restart', () => {
      router.reload()
    })

    socket.on('update-player', (msg: any) => {
      setPlayer(msg.player)
      setInitCountDown(true)
    })

    socket.on('joinRoom', (msg: any) => {
      console.log("你已加入房间")
    })
  }

  useEffect(() => {
    if (restart) {
      socket.emit('game-restart', {
        roomName,
      })
      router.reload()
    }
    if (initCountDown) {
      const playerStr = player === 'red' ? 'black' : 'red'
      socket.emit('player-change', {
        roomName,
        player: playerStr,
      })
    }
  }, [restart, initCountDown])

  useEffect(() => {
    if (!init) {
      getRoomVisitors()
      socketInitializer();
    }

    if (!queryId && typeof queryId !== 'string') {
      setRoomName(roomName)
      setIdentify('organiger')
      removeRoom()
    }

    if (queryId && typeof queryId === 'string') {
      setRoomName(queryId)
      setIdentify('invitee')
    }

    if (clientRef.current) {
      const rect = clientRef.current.getBoundingClientRect();
      if (rect.width > rect.height) {
        setCellWidth(Math.floor(rect.height - 60) / 10)
      } else {
        setCellWidth(Math.floor(rect.width - 60) / 9)
      }
    }

    if (data) {
      setVisitorId(data?.visitorId)
    }

    setInit(true)
  }, [init, data, room])

  useEffect(() => {
    if (visitorId) {
      addRoomVisitor()
    }
  }, [visitorId])

  return (
    <ChessPiecesProvider>
      <OldPosProvider>
          <Box
            ref={ clientRef }
            w='100vw'
            minH='100vh'
          >
            <Flex direction={{ base: 'column', sm: 'column', md: 'column', lg: 'row' }} minH='100vh' alignItems='center' gap={6} justifyContent='center' >
              <Box>
                <Gamer 
                  color="black"
                  player={player}
                  curPlayer={curPlayer}
                  initCountDown={initCountDown}
                  convert={convert}
                  handleSetInitCountDown={(val: boolean) => setInitCountDown(val)}
                  handleSetTriggerRecover={(val: boolean) => setTriggerRecover(val)}
                  handleSetWinPlayer={(str: string) => setWinPlayer(str)}
                  handleSetConvert={(val: boolean) => setConvert(val)}
                />
              </Box>
              <Box 
                style={{
                  position: 'relative',
                  width: 'fit-content',
                }}
              >
                <ChessBoard width={width} cellWidth={cellWidth} />
                <ChessPieces
                  cellWidth={cellWidth}
                  player={player}
                  curPlayer={curPlayer}
                  socket={socket}
                  recover={recover}
                  oldFocusPiece={oldFocusPiece}
                  oldTouchPiece={oldTouchPiece}
                  handleSetCurPlayer={(str: string) => setCurPlayer(str)}
                  handleSetWinPlayer={(str: string) => setWinPlayer(str)}
                  handleSetRecover={(val: boolean) => setRecover(val)}
                  handleSetTriggerRecover={(val: boolean) => setTriggerRecover(val)}
                  handleSetConvert={(val: boolean) => setConvert(val)}
                  handleSetOldFocusPiece={(arg: any) => setOldFocusPiece({...oldFocusPiece, ...arg})}
                  handleSetOldTouchPiece={(arg: any) => setOldTouchPiece({...oldTouchPiece, ...arg})}
                />
              </Box>
              <Box>
                <Gamer
                  color="red"
                  player={player}
                  curPlayer={curPlayer}
                  initCountDown={initCountDown}
                  convert={convert}
                  handleSetInitCountDown={(val: boolean) => setInitCountDown(val)}
                  handleSetTriggerRecover={(val: boolean) => setTriggerRecover(val)}
                  handleSetWinPlayer={(str: string) => setWinPlayer(str)}
                  handleSetConvert={(val: boolean) => setConvert(val)}
                />
              </Box>
            </Flex>
            <ModalWin isDisabled={isDisabled} text={winPlayerText} trigger={triggerWin} handleSetRestart={(val: boolean) => setRestart(val)} />
            <ModalPlayer
              roomName={roomName}
              text='请选择己方为哪方棋手？'
              handleSetPlayer={(str: string) => setPlayer(str)}
              handleSetInitCountDown={(val: boolean) => setInitCountDown(val)}
              trigger={triggerPlayer}
            />
            <ModalRecover 
              text='是否确认悔棋'
              trigger={triggerRecover}
              handleSetRecover={(val: boolean) => setRecover(val)}
              oldFocusPiece={oldFocusPiece}
              oldTouchPiece={oldTouchPiece}
              handleSetOldFocusPiece={(arg: any) => setOldFocusPiece({...oldFocusPiece, ...arg})}
              handleSetOldTouchPiece={(arg: any) => setOldTouchPiece({...oldTouchPiece, ...arg})}
            />
          </Box>
      </OldPosProvider>
    </ChessPiecesProvider>
  )
}

Chess.getInitialProps = async ({ query }) => {
  const queryId = query ? query.roomName : '';
  return {
    queryId: queryId,
  };
}

export default Chess
