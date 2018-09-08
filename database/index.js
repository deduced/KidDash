const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');


mongoose.connect('mongodb://localhost/KidDashDatabase');
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'db connection error'));
db.once('open', () => console.log('Database successfully connected'));

let fileSchema = new mongoose.Schema({
  caption: String,
  url: { type: String, unique: true},
  timeStamp: { type: Date, default: Date.now },
  category: String
});

// var eventSchema = new Schema({ thing: { type: 'string', unique: true }})
// confirm we can leave String


let FileModel = mongoose.model('FileModel', fileSchema);

const getFiles = (details = {}, response) => { // retrieve
  // when GET request is invoked,
  // take this response parameter
  FileModel.find(details).exec((err, data) => {
    if (err) {
     return console.error(`error while retrieving files: ${err}`);
    }
    // response.statusCode(200).send(data);
    response.status(200).send(data);
  });
};

const saveFile = (fileDetails, response) => { // create
  let newFile = new FileModel(fileDetails);
  newFile.save(err => {
    if (err && err.code !== 11000) {
      console.error(`error while saving file: ${err}`);
      response.status(500).send(err);
      return;
    } else if (err && err.code === 11000) {
      console.error(`URL already exists, cannot save file. Error: ${err}`);
      response.status(400).send(err);
      return;
    }
    getFiles({}, response);
  });
};

const updateFile = (id, update, response) => { // update
  FileModel.findByIdAndUpdate(id, update, (err, updatedFile) => {
    if (err) {
      console.error(`Error while updating file. Error: ${err}`);
      response.status(500).send(err);
      return;
    }
    console.log(`Updated file with previous caption: ${updatedFile.caption}`); // console.logs previous state of file
    getFiles({}, response);
  });
};

const deleteFile = (id, response) => { // delete
  FileModel.findByIdAndRemove(id, (err, deletedFile) => {
    if (err) {
      console.error(`Error while deleting file from database. Error: ${err}`);
      response.status(500).send(err);
      return;
    }
    console.log(`Deleted file with caption: ${deletedFile.caption}`);
    getFiles({}, response);
  });
};

module.exports.getFiles = getFiles;
module.exports.saveFile = saveFile;
module.exports.updateFile = updateFile;
module.exports.deleteFile = deleteFile;