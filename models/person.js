const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: [3, 'the name must have 3 or more letters'],
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function (v) {
                return /\d{3}-\d{5}/.test(v) || /\d{2}-\d{6}/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)