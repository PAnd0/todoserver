import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Todo from './models/Todo';

var app = express();
var router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/todos');

var connection = mongoose.connection;

connection.once('open', () => {
  console.log('MongoDB database connection established');
});

router.route('/todos').get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

router.route('/todos/:id').get((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todo);
    }
  });
});

router.route('/todos').post((req, res) => {
  console.log(req.body);
  var todo = new Todo(req.body);
  todo.save()
    .then(todo => {
      res.status(200).json({'todo':'Added successfully'});
    })
    .catch(err => {
      res.status(400).send('Failed to create new record');
    })
});

router.route('/todos/update/:id').post((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
      if (!todo)
          return next(new Error('Could not load Document'));
      else {
          todo.title = req.body.title;
          todo.isDone = req.body.isDone;

          todo.save().then(todo => {
              res.json('Update done');
          }).catch(err => {
              res.status(400).send('Update failed');
          });
      }
  });
});

router.route('/todos/delete/:id').get((req, res) =>{
  Todo.findByIdAndRemove({_id: req.params.id}, (err, todo) => {
    if (err) {
      res.json(err);
    } else {
      res.json('Removed successfully');
    }
  });
});

app.use('/', router);

app.get('/', (req, res) => res.send('<h1>Welcome to Todo Web App!!'));
app.listen(4000, () => console.log('Express server running on port 4000'));