const express = require('express')
const app = express()

app.use(express.json())

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  }
]

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.get('/api/persons/', (req, res) => {
    res.json(persons)
  })
  
app.get('/info/', (req, res) => {
    const date = new Date()
    res.send(`<p>Phonebook has info for ${persons.length} people <br><br> ${date} </p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.post('/api/persons', (request, response) => {
  const person_scratch = request.body
  
  if (!person_scratch.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!person_scratch.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if (persons.find(({name}) => name === person_scratch.name)) {
    return response.status(400).json({ 
      error: 'name already in phonebook' 
    })
  }

  const id = getRandomInt(persons.length*10000)
  const person = {
    id: id,
    name: person_scratch.name,
    number: person_scratch.number
  }

  console.log(person)
  
  persons = persons.concat(person)
  response.json(person)
})