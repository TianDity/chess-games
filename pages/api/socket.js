// import type { NextApiRequest, NextApiResponse } from 'next'
import { Server } from 'socket.io'

const SocketHanler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running')
  } else {
    console.log('Socket is initializing')
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.on('joinRoom', (msg) => {
        socket.join(msg.roomName);
      })
      socket.on('game-restart', (msg) => {
        socket.broadcast.to(msg.roomName).emit('update-restart', msg)
      })
      socket.on('pieces-change', msg => {
        socket.broadcast.to(msg.roomName).emit('update-pieces', msg)
      })
      socket.on('focus-change', msg => {
        socket.broadcast.to(msg.roomName).emit('update-focus', msg)
      })
      socket.on('player-change', msg => {
        socket.broadcast.to(msg.roomName).emit('update-player', msg)
      })
      socket.on('winplayer-change', msg => {
        socket.broadcast.to(msg.roomName).emit('update-winplayer', msg)
      })
      socket.on('recover-change', msg => {
        socket.broadcast.to(msg.roomName).emit('update-recover', msg)
      })
    })
  }

  res.end()
}


export default SocketHanler
