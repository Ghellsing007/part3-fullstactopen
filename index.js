
// index.js
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// Importa los middlewares personalizados
const { unknownEndpoint, errorHandler } = require('./middleware/middleware.js')

const app = express()


// Middlewares generales
app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

// Configuración de morgan para registrar el cuerpo en POST
morgan.token('body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// Rutas principales
app.get('/', (req, res) => {
  res.send('<h1>Esta API REST de Personas</h1>')
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      res.send(
        `<h1>Phonebook has info for ${count} people</h1><br/><p>${new Date()}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name || !number) {
    return res.status(400).json({
      error: 'falta el nombre o el número'
    })
  }

  // Comprobación de nombre único
  Person.findOne({ name: name })
    .then(existingPerson => {
      if (existingPerson) {
        return res.status(400).json({
          error: 'el nombre debe ser único'
        })
      }

      const person = new Person({ name, number })
      return person.save()
    })
    .then(savedPerson => {
      if (savedPerson) {
        res.json(savedPerson)
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body
  const updatedPerson = { name, number }

  Person.findByIdAndUpdate(
    req.params.id,
    updatedPerson,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end()
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

// Usa el middleware para endpoints desconocidos
app.use(unknownEndpoint)

// Usa el middleware centralizado para manejo de errores
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

