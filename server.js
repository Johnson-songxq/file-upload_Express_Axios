const express = require("express");
const fileUpload = require("express-fileupload");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const path = require("path");

//create web server
const app = express();
app.use(cors());
app.use(fileUpload());

//error middleware, first argument is err
app.use((err, req, res, next) => {
  res.status(500).send("Server Error");
});

//call localhost:80/upload
app.post("/upload", (req, res) => {
  //check if file was uploaded
  if (!req.files || !req.files.file) {
    return res.status(400).json({
      error: "No file uploaded",
    });
  }

  //file: in example it is the name of input
  const file = req.files.file;
  //validate file size
  const maxSize = 10 * 1024 * 1024; //10mb
  if (file.size > maxSize) {
    return res.status(400).json({
      error: "File size is too big",
    });
  }

  //generate unique filename
  //The path.extname() method returns the extension of a file path.
  const fileName = uuidv4() + path.extname(file.name);
  const upload_dir = `${__dirname}/client/public/uploads`;
  //save file to uploads folder
  file.mv(`${upload_dir}/${fileName}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json({
      fileName: fileName,
      filePath: `/uploads/${fileName}`,
    });
  });
});

app.listen(80, () => console.log("Server is runing on http://localhost:80"));
