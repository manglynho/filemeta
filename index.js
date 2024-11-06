var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    console.log(file);
    cb(null,file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // 1MB limit
}).single('upfile');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    let fileNameWithoutExt = path.parse(req.file.originalname).name;
    res.json({
      name: fileNameWithoutExt,
      type: req.file.mimetype,
      size: req.file.size
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
