require('dotenv').config()
const mongoose = require('mongoose')

const url = `mongodb+srv://${process.env.SU}:${process.env.SU}@cluster0.1cmxn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

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
    name: {
        type: String,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres.'], // ✅ Mensaje personalizado
        required: [true, 'El nombre es obligatorio.'] // ✅ Mensaje personalizado
    },
    number: {
        type: String,
        required: [true, 'El número de teléfono es obligatorio.'],
        validate: {
            validator: function (v) {
                // La expresión permite que la primera parte tenga 2 o 3 dígitos, seguida de uno o más grupos que comiencen con un guión y contengan uno o más dígitos.
                return /^\d{2,3}(-\d+)+$/.test(v) && v.length >= 8
            },
            message: 'El número debe estar en el formato correcto (Ejemplo: 09-1234567, 040-22334455 o 375-338-3784) y tener 8 o más caracteres.'
        }
    }


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
