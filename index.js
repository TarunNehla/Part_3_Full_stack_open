require('dotenv').config();
const express = require('express')
const app = express()
const cors = require('cors')
var morgan = require('morgan')
const Person = require('./models/phonebook')
app.use(cors())
app.use(express.json())

app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const getId = () => {
    const id = Math.floor(Math.random() * 10000)
    return String(id)
}

app.get('/', (request,response) =>{
    response.send('<h1>Backend</h1>')
})

app.get('/api/persons', (request,response)=>{
    Person.find({}).then(result=>{
        response.json(result)
    })
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</br>${new Date()}</p>`);
});

app.get('/api/persons/:id', (request,response)=>{
    Person.findById(request.params.id).then(result =>{
        response.json(result)
    })
})


app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    persons = persons.filter(p => p.id!==id)
    response.status(204).end()
})

app.post('/api/persons', (request,response)=>{
    const newp = request.body

    if (!newp.name) {
        return response.status(404).json({ error: 'name is missing' });
    } else if (!newp.number) {
        return response.status(404).json({ error: 'number of person is missing' });
    }
    
    // const checkPerson = persons.find(n => n.name === newp.name);
    // if (checkPerson) {
    //     return response.status(404).json({ error: 'name already exists, provide another name' });
    // }

    const newPerson = new Person({
        name : newp.name,
        number : newp.number, 
    })

    newPerson.save().then(result=>{
        response.json(result)
    })
})

const PORT = 3001;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})