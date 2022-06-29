const socket = io('http://localhost:3000/admin/chat')

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    console.log(message)
    socket.emit('adminchat',message,(error)=>{
        // $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})

