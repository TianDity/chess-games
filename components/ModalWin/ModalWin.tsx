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
import { useEffect } from 'react'
import { useRouter } from 'next/router'

interface Props {
  text: string;
  trigger: boolean;
  isDisabled: boolean;
  handleSetRestart: any;
}

function ModalWin({ text, trigger, isDisabled, handleSetRestart }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const handleReload = () => {
    handleSetRestart(true)
  }

  const handleBackHome = () => {
    router.replace('/')
  }

  useEffect(() => {
    if (trigger) {
      onOpen()
    }
  }, [trigger])

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
            <Button colorScheme='teal' mr={3} onClick={handleReload} isDisabled={isDisabled}>
              再来一局
            </Button>
            <Button colorScheme='teal' mr={3} onClick={handleBackHome}>
              回到首页
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalWin
