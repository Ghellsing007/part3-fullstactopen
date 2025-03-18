// middlewares.js

// Middleware para endpoints desconocidos
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }
  
  // Middleware centralizado para el manejo de errores
  const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'ValidationError') {
        // ✅ Extrae solo el mensaje de error limpio
        const errores = Object.values(error.errors).map(err => err.message)
        return res.status(400).json({ error: errores.join(' ') }) // ✅ Unir todos los errores en una sola respuesta
    }

    next(error)
}
  
  module.exports = { unknownEndpoint, errorHandler }
  