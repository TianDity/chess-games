import {
  Text,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Box,
  useToast
} from '@chakra-ui/react'
import { useEffect } from 'react';
import QRCode from 'qrcode.react'
import { css } from '@emotion/react'
import copy from 'copy-to-clipboard'


interface Props {
  roomName: string;
  text: string;
  trigger: boolean;
  handleSetPlayer: any;
  handleSetInitCountDown: any;
}

function ModalPlayer({ roomName, text, trigger, handleSetPlayer, handleSetInitCountDown }: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const urlStr = `localhost:3000/chess?roomName=${roomName}`

  const handleBtnClick = (e: any) => {
    const player = e.target.dataset.id;
    handleSetPlayer(player);
    handleSetInitCountDown(true)
    onClose();
  }

  const handleCopy = () => {
    copy(urlStr)
    toast({
      title: '链接已复制',
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }

  useEffect(() => {
    if (trigger) {
      onOpen();
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
            <Flex direction='column' align='center' gap={4}>
              <Box>
                <QRCode
                  value={urlStr}
                  size={140}
                  color="#000000"
                />
              </Box>
              <Flex direction='row' align='center' gap={4}>
                <Text css={{width:'200px',overflow:'hidden',whiteSpace:'nowrap',textOverflow:'ellipsis'}}>邀请链接：{urlStr}</Text>
                <Button onClick={handleCopy}>复制</Button>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='teal' mr={3} onClick={ handleBtnClick } data-id="red">
                己方为红方（先手）
            </Button>
            <Button colorScheme='teal' mr={3} onClick={ handleBtnClick } data-id="black">
                己方为黑方
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ModalPlayer
