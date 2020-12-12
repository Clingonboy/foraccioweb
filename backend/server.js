const server = require('http').createServer()
const cors = require('cors')
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST']
    }
})


io.on('connection', client => {
    console.log('connesso')
    client.emit('init', { data: 'hello world' })
})

server.listen(3000)
