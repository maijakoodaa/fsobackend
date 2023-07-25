const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://phonebook:${password}@cluster0.sl0pf9j.mongodb.net/peopleApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

const id = getRandomInt(50000)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length > 3) {
    const person = new Person({
      id: id,
      name: process.argv[3],
      number: process.argv[4],
    })

    person.save().then(result => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
    })
}
else {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}

