require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(express.json())

app.use(morgan('tiny'))

// create a token
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('build'))

// mongodb config
const Person = require('./models/person')

app.get('/', (res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(data => {
            res.json(data)
        })
        .catch(err => next(err))
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(result => {
            if (result) {
                res.json(result)
            }else {
                res.status(404).end()
            }
        })
        .catch(err => next(err))
})

app.get('/info', (req, res, next) => {
    Person.find({})
        .then(data => {
            const current_data = data.length
            const date = new Date()
            res.send(`Phonebook has info for ${current_data} people <br/> ${date}`)
        })
        .catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            console.log(result)
            res.status(204).end()
        })
        .catch(err => next(err))
})

app.post('/api/persons', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: `${body.name}`,
        number: `${body.number}`
    })

    person.save()
        .then(savedPerson => {
            console.log(savedPerson)
            res.json(savedPerson)
        })
        .catch(err => {
            res.status(400).json({ error: err.message })
            next(err)
        })
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            console.log(updatedPerson)
            res.json(updatedPerson)
        })
        .catch(err => next(err))
})

app.listen(3001, () => console.log(`Server running on port ${3001}`))