

document.querySelector('#login').addEventListener('submit', async event => {
    event.preventDefault()
    const message = document.querySelector('#error-message')
    message.textContent = 'loading...'
    const res = await fetch('/login', {
      // Rest of the Form populating logic (headers and body)
    })
    const json = await res.json()
    if (json.error) {
      message.textContent = json.error
      return
    }
  
    form.reset()
    window.location = '/loginSuccess.html'
  })