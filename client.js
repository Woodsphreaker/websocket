const getParam = () => {
  const params = location.hash.slice(1).split('/')
  return params
}

const [name, id] = getParam()
const socket = new WebSocket(`ws://localhost:4040/${name}/${id}`)

// socket.addEventListener('open', event => {
//   socket.send(`{"message": "${name} Conectou" }`)
// })

socket.addEventListener('message', event => {
  const pannel = document.querySelector('#pannel')
  const p = document.createElement('p')
  pannel.appendChild(p)
  p.innerText = event.data
})

const sendMessage = event => {
  const message = document.querySelector('#message')
  socket.send(`{"message": ${JSON.stringify(message.value)} }`)
  message.value = ''
}

document.addEventListener('DOMContentLoaded', () => {
  document
    .querySelector('button')
    .addEventListener('click', sendMessage)

  document
    .querySelector('#message')
    .addEventListener('keydown', event => {
      const key = event.keyCode
      if (key === 13) {
        sendMessage()
      }
    })
})
