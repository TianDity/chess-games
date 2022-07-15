import Image from 'next/image'
import { useEffect, useState } from 'react';
import CountDown from '../CountDown'
import { Box, Button, Stack, Text, Flex } from '@chakra-ui/react'

interface Props {
  color: string;
  player: string;
  curPlayer: string;
  initCountDown: boolean;
  convert: boolean;
  handleSetInitCountDown: any;
  handleSetWinPlayer: any;
  handleSetConvert: any;
  handleSetTriggerRecover: any;
}

function GamerItem({ color, player, curPlayer, initCountDown, convert, handleSetInitCountDown, handleSetWinPlayer, handleSetConvert, handleSetTriggerRecover }: Props) {
  const [start, setStart] = useState(false);
  const gamers = {
    red: '红方棋手',
    black: '黑方棋手',
  }

  const gamer = gamers[color as keyof typeof gamers];

  const handleSetStart = (data: boolean) => {
    setStart(data);
  }

  const handleClickRecover = () => {
    handleSetTriggerRecover(true)
  }

  useEffect(() => {
    if (initCountDown && color === curPlayer) {
      setStart(true)
    }
  }, [initCountDown])

  return (
    <Flex direction={{ base: 'column', sm: 'row', md: 'row', lg: 'column' }} align='center' gap={3}>
      <Box>
        <Stack direction={{ base: 'column', sm: 'row', md: 'row', lg: 'column' }} align='center'>
          <Image
            src='/me.svg'
            width='30px'
            height='30px'
          />
          <Text>{ gamer }</Text>  
        </Stack>
      </Box>
      <Box>
        <CountDown 
          hours='0'
          minutes='0'
          seconds='59'
          start={start}
          convert={convert}
          player={player}
          curPlayer={curPlayer}
          handleSetWinPlayer={handleSetWinPlayer}
          handleSetStart={handleSetStart}
          handleSetConvert={handleSetConvert}
        />
      </Box>
      <Box>
        <Button onClick={handleClickRecover}>悔棋</Button>
      </Box>
    </Flex>
  )
}


export default GamerItem
