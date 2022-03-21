const http = require("http")
const socketio = require("socket.io")

const server = http.createServer();

const io = socketio(server, () => {
    console.log(server);
});

io.on("connection", async (socket) => {
    console.log('user connected to socket: ' + socket.id);
    socket.join(socket.id);
    console.log('join userId: ', socket.id);
    io.to(socket.id).emit('private', `hi, ${socket.id}`)

    socket.on('message', ({ data }) => {
        console.log('data: ', data, socket.id);
        io.emit('response', `to everyone`)
    })
});


server.listen(8080);