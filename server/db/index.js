const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');

mongoose.connect('mongodb://localhost:27017/JustTalk', {
  useMongoClient: true
});

mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('db connected!');
});
