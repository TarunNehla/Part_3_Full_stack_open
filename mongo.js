const mongoose  = require('mongoose')

if(process.argv.length<3){
    console.log('Provide password to connect')
    process.exit(1)
}

const password = process.argv[2];
// connect with monggose 

const url =
  `mongodb+srv://tarundh:${password}@cluster0.lek7bdv.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name : String,
    number : String,
})

const Person = mongoose.model('Person', personSchema)




// if length is 5 

if(process.argv.length==5){
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name : name,
        number : number,
    })
    person.save().then(result =>{
        console.log(`added ${name} ${number} to phonebook`)
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then(result=>{
        result.forEach(per=>{
            console.log(per)
        })
        mongoose.connection.close()
    })
}


// else if only length is 3 

