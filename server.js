
const Websocket = require('ws')
const server = new Websocket.Server({ port: 4040 })
const clients = {}

const broadcastMessages = (server, name, message) => {
  server.clients.forEach(client => {
    client.send(`${name} diz: ${message}`)
  })
}

const privateMessage = (id, name, message) => {
  clients[id]
    .ws
    .send(`${name} diz: ${message}`)
}

const onMessage = (server, req) => data => {
  const [ name, id ] = req.url.split('/').slice(1)
  const { message } = JSON.parse(data)

  // Broadcast
  broadcastMessages(server, name, message)

  // Private messages
  // privateMessage('456', name, message)
}

server.on('connection', (ws, req) => {
  const [ name, id ] = req.url.split('/').slice(1)
  clients[id] = { name, ws }
  ws.id = id

  for (const client of server.clients) {
    client.send(`${name} Conectou`)
  }

  ws.on('message', onMessage(server, req))

  ws.on('close', data => {
    const { name } = clients[ws.id]

    server.clients.forEach(client => {
      client.send(`${name} desconectou`)
    })
  })
})
