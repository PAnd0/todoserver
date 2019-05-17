import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var Todo = new Schema({
  title: { type: String },
  isDone: { type: Boolean }
});

export default mongoose.model('Todo', Todo);