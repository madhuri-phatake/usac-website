const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the directory where files will be stored
    cb(null, '/uploads');
  },
  filename: function (req, file, cb) {
    // Define the filename for uploaded files
    cb(null, file.originalname);
  }
});

// Create an instance of multer middleware
const upload = multer({ storage: storage });

// Endpoint to handle file upload
router.post('/uploadfile', upload.single('file'), (req, res) => {
  // Access the uploaded file through req.file
  console.log(req.obj,"fils")
  if (!req.obj) {
    return res.status(400).send('No files were uploaded.');
  }
  res.send('File uploaded successfully!');
});

module.exports = router;