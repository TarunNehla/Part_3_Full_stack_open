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






// const getId = () => {
//     const id = Math.floor(Math.random() * 10000)
//     return String(id)
// }

app.get('/', (request,response) =>{
    response.send('<h1>Backend</h1>')
})

app.get('/api/persons', (request,response)=>{
    Person.find({}).then(result=>{
        response.json(result)
    })
})

// app.get('/info', (request, response) => {
//     response.send(`<p>Phonebook has info for ${persons.length} people</br>${new Date()}</p>`);
// });

app.get('/api/persons/:id', (request,response,next)=>{
    Person.findById(request.params.id)
    .then(result =>{
        if(result){
            response.json(result)
        }
        else{
            response.status(404).end()
        }
    })
    .catch(error =>next(error))
})


app.delete('/api/persons/:id',(request,response,next)=>{
    Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
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

const otherEndpoint = (request,response) =>{
    response.status(404).send({error : 'this url dont exist'})
}

app.use(otherEndpoint)

const errorHandler = (error,request,response,next) =>{
    console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = 3001;
app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
})