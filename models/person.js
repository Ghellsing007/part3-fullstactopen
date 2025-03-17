require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)
    .then(() => {
        console.log('Conectado a MongoDB')
    })
    .catch((err) => {
        console.error('Error al conectarse a MongoDB:', err)
        process.exit(1)
    })

// Definición del esquema y modelo para la persona
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

// Configurar la transformación para convertir _id a id y eliminar __v
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
