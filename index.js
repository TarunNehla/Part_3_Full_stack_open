const express = require('express')
const app = express()
var morgan = require('morgan')
app.use(express.json())
app.use(morgan('tiny'))

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
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} people</br>${new Date()}</p>`);
});

app.get('/api/persons/:id', (request,response)=>{
    const id = request.params.id
    const person = persons.find(p => p.id===id)
    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }
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
    
    const checkPerson = persons.find(n => n.name === newp.name);
    if (checkPerson) {
        return response.status(404).json({ error: 'name already exists, provide another name' });
    }

    const newNote = {
        id : getId(),
        name : newp.name,
        number : newp.number
    }
    persons = persons.concat(newNote)
    response.status(201).send(newNote)
})

const PORT = 3001;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})