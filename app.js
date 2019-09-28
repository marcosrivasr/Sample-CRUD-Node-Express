const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public')); 

mongoose.connect('mongodb://dev:dev@localhost:27017/todos', {useNewUrlParser: true, useUnifiedTopology: true})
.catch(err => console.log('Error de conexión: ', err.message));

const connection = mongoose.connection;

connection.once('open', () =>{
    console.log('Conectado a la BD...');

});

connection.on('error', (err) =>{
    console.error('Error con la BD:', err.message);
});

const Todo = mongoose.model('Todo', { text: String, completed: Boolean });

app.post('/add', (req, res) =>{

    const todo = new Todo({ text: req.body.text, completed: false });
    
    todo.save().then(doc =>{
        console.log('Dato insertado: ', doc);
        res.redirect('/');
        //res.json({response: 'success'});
    })
    .catch(err => {
        console.error('Error al insertar: ', err.message);
        res.json({response: 'insert failed'});
    });
    
});
app.get('/getall', (req, res) =>{
    
    Todo.find().then(doc =>{
        res.json({response: 'success', data: doc });
    })
    .catch(err => {
        console.error('Error al insertar: ', err.message);
        res.json({response: 'insert failed'});
    });
});

app.get('/complete/:id/:status', (req, res) =>{
    
    const id = req.params.id;
    const checked = req.params.status == 'true';

    Todo.findByIdAndUpdate({_id: id}, {$set: {completed: checked}})
    .then(doc =>{
        res.json({response: 'success'});
    })
    .catch(err => {
        console.error('Error al actualizar: ', err.message);
        res.json({response: 'update failed'});
    });
});

app.get('/delete/:id/', (req, res) =>{
    
    const id = req.params.id;

    Todo.findByIdAndRemove({_id: id})
    .then(doc =>{
        
        res.redirect('/')
        //res.json({response: 'success'});
    })
    .catch(err => {
        console.error('Error al eliminar: ', err.message);
        res.json({response: 'remove failed'});
    });
});

app.listen(3000);