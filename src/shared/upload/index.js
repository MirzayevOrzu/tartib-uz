const path = require("node:path");
const uuid = require("uuid");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "..", "uploads"),
  filename: function (req, file, cb) {
    console.log(file);
    const filename = uuid.v4() + path.extname(file.originalname);
    cb(null, filename);
  },
});

const upload = multer({ storage });

module.exports = upload;
