const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const password = process.argv[2]
// eslint-disable-next-line no-undef
const person_name = process.argv[3]
// eslint-disable-next-line no-undef
const person_number = process.argv[4]
const url = `mongodb+srv://cauber:${password}@cluster0.kee5upy.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema(
    {
        name: String,
        number: String
    }
)

const Person = mongoose.model('Person', personSchema)

if (!password) {
    console.log('enter your password')
    // eslint-disable-next-line no-undef
    process.exit(1)
    return true
}

if (!person_name || !person_number) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(values => {
            console.log(`${values.name}  ${values.number}`)
        })
        // eslint-disable-next-line no-undef
        process.exit(1)
        mongoose.connection.close()
    })

    return true
}

const person = new Person({
    name: person_name,
    number: person_number
})

person.save().then(result => {
    console.log(`added ${person.name} ${person.number} to phonebook!\n`, result)
    mongoose.connection.close()
})