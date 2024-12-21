const multer = require('multer');
const path = require('path');

// Imposta la cartella di destinazione e il nome del file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/product-images');  // Cartella per salvare le immagini
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Timestamp per evitare conflitti di nomi
  },
});

// Imposta le limitazioni (ad esempio 5MB per ogni file)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5MB
});

module.exports = upload;
