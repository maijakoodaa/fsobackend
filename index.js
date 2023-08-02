require('dotenv').config()
const express = require('express')
const morgan = require('morgan');

const app = express()
const cors = require('cors')
const Person = require('./models/person')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)



morgan.token('data', request => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
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

app.get('/api/persons/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})
  
app.get('/info/', (req, res) => {
    const date = new Date()
    Person.find({}).then(persons => {
      res.send(`<p>Phonebook has info for ${persons.length} people <br><br> ${date} </p>`)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      //const id = Number(request.params.id)
      //persons = persons.filter(person => person.id !== id)
      response.status(204).end()
    })
    .catch(error => next(error))
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true, context: 'query'  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
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
  const id = getRandomInt((persons.length+1)*10000)
  const person = new Person({
    id: id,
    name: person_scratch.name,
    number: person_scratch.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
  
  .catch(error => next(error))
      //persons = persons.concat(person)
      //response.json(person)

  /*if (persons.find(({name}) => name === person_scratch.name)) {
    return response.status(400).json({ 
      error: 'name already in phonebook' 
    })
  }*/
  
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})