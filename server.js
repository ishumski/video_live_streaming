const express = require('express')
const app = express()
const server = require('http').createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)
const { v4: uuidV4 } = require('uuid')

require('dotenv').config()

//шаблонизатор представления
app.set('view engine', 'ejs')
//ф-ция промежуточной обработки
app.use(express.static('public'))


//создание homepage нашего приложения которая будет редиректить на комнату чата
app.get('/', (req, res)=>{
    res.redirect(`/${uuidV4()}`)
})

//создание комнаты чата
app.get('/:room', (req, res)=>{
    //id будем брать из URL выше
    res.render('room', {roomId: req.params.roomId })
})

io.on('connection', socket=>{
    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId)
        socket?.to(roomId)?.broadcast?.emit('user-connected', userId)

        socket.on('disconnect', ()=>{
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})


const PORT = process.env.PORT || 5000

server.listen(PORT , ()=> console.log(`Server is started on PORT ${PORT}`) )

