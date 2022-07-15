import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useChessPieces, useChessPiecesDispatch } from '../../store/ChessPiecesContext'
import { useOldPos, useOldPosDispatch } from '../../store/OldPosContext'
import { roomIdAtom } from '../../pages/chess'
import { useAtom } from 'jotai'

type Props = {
  text: string,
  trigger: boolean,
  oldFocusPiece: any,
  oldTouchPiece: any,
  handleSetRecover: any,
  handleSetOldFocusPiece: any,
  handleSetOldTouchPiece: any,
}

function ModalRecover({ text, trigger, oldFocusPiece, oldTouchPiece, handleSetRecover, handleSetOldFocusPiece, handleSetOldTouchPiece }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const chessPieces = useChessPieces()
  const chessPiecesDispatch = useChessPiecesDispatch()
  const oldPosDispatch = useOldPosDispatch()
  const { oldFocusId, oldTouchId, oldTouchType } = useOldPos()
  const [roomName, setRoomName] = useAtom(roomIdAtom)


  const handleRecover = () => {
    if (!oldFocusId && !oldTouchId) {
      handleSetRecover(false)
      onClose()
    }

    if (oldFocusId && oldTouchId) {
      chessPiecesDispatch({
        type: 'set_piece',
        oldFocusPiece,
        oldTouchPiece,
      })
      handleSetRecover(true)
    }
    onClose()
  }

  useEffect(() => {
    if (trigger) {
      onOpen();
    }
    if (oldTouchId) {
      const [xTouch, yTouch] = oldTouchId.split('-').map(Number);
      const curTouchPiece = chessPieces[yTouch][xTouch];
      const oldTouchColor = curTouchPiece.color === 'red' ? 'black' : 'red';
    
      handleSetOldTouchPiece({
        id: oldTouchId || '',
        type: oldTouchType || '',
        color: oldTouchColor || '',
        status: oldTouchType ? 1 : 0,
      })
      handleSetOldFocusPiece({
        id: oldFocusId || '',
        type: curTouchPiece.type || '',
        color: curTouchPiece.color || '',
        status: 1,
      })
    }
  }, [trigger, oldTouchId])

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>游戏提示</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            { text }
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={handleRecover}>
              确认
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalRecover
