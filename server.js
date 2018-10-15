
const Websocket = require('ws')
const server = new Websocket.Server({ port: 4040 })
const clients = {}

// Broadcast Messages
const broadcastMessages = (server, message) => {
  for (const client of server.clients) {
    client.send(message)
  }
}

// Private messages
const privateMessage = (id, name, message) => {
  clients[id]
    .ws
    .send(`${name} diz: ${message}`)
}

const onMessage = (server, ws) => data => {
  const { name } = clients[ws.id]
  const { message } = JSON.parse(data)

  broadcastMessages(server, `${name} diz: ${message}`)

  // privateMessage('456', name, message)
}

const onClose = (server, ws) => data => {
  const { name } = clients[ws.id]
  broadcastMessages(server, `${name} desconectou`)
}

server.on('connection', (ws, req) => {
  const [ name, id ] = req.url.split('/').slice(1)
  clients[id] = { name, ws }
  ws.id = id

  broadcastMessages(server, `${name} Conectou`)

  ws.on('message', onMessage(server, ws)) // data is implicity
  ws.on('close', onClose(server, ws)) // data is implicity
})
