const weatherForm = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const messageTwo = document.querySelector('#message-2')
const image = document.querySelector('#responseIMG')
const editButton= document.querySelector('#EditBtn')
//const apiBasePath = "http://localhost:3000";
const apiBasePath = "http://jenkins.neoint.ai:3000";

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()    
    
    const promptEntered = search.value

    messageOne.textContent = 'Loading...'  
    image.src = ""  

    fetch(apiBasePath + '/generateIMG', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptEntered })
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {                
                image.src = data.img
                messageOne.textContent = data.location
            }
        })
    })
})

editButton.addEventListener('click', (e) => {
    e.preventDefault()  

    //let imgName = image.src.replace("http://localhost:3000/img/","")
    let imgName = image.src
    const promptEntered = search.value

    messageOne.textContent = 'Loading...'  
    image.src = "" 

    fetch(apiBasePath + '/editIMG', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: promptEntered, img: imgName})
    }).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {                
                image.src = "/img/"+ data.img
                messageOne.textContent = data.location
            }
        })
    })  
})