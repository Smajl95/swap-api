const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer'); // Importa multer per gestione upload
const fs = require('fs');
const path = require('path');
const User = require('./models/user'); // Modello User
const Product = require('./models/product'); // Modello Prodotto
const productRouter = require('./routes/productRoutes'); // Importa il router per i prodotti
const authRouter = require('./routes/auth'); // Importa le rotte di autenticazione
const orderRouter = require('./routes/orderRoutes');// 

// Carico variabili d'ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Middleware per gestire JSON nel corpo della richiesta

// Configurazione multer per caricamento file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Cartella dove salvare le immagini
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Nome file unico con timestamp
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite di 5MB per file
}).array('images[]', 10);  // 'images' deve corrispondere al nome del campo in Postman

// Servire i file statici dalla directory 'uploads'
app.use('/uploads', express.static('uploads'));

// Connessione al database MongoDB
const connectDB = require('./config/db');
connectDB(); // Funzione per connettersi al database

// Funzione per proteggere le rotte con autenticazione JWT
const protectRoute = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Estrai il token

  if (!token) {
    return res.status(401).json({ message: 'Autenticazione necessaria' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica il token
    req.user = decoded; // Aggiungi l'utente decodificato alla request
    next(); // Passa alla rotta successiva
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido' });
  }
};

// Route protetta 
app.get('/api/protected', protectRoute, (req, res) => {
  res.json({ message: 'Rotta protetta, accesso autorizzato', user: req.user });
});

// Endpoint per inserire un prodotto con foto
app.post('/api/products', upload, async (req, res) => {
  const { name } = req.body;
  const photos = req.files;

  if (!name || !photos || photos.length === 0) {
    return res.status(400).json({ message: 'Nome prodotto e foto sono richiesti' });
  }

  try {
    const newProduct = new Product({
      name,
      photos: photos.map(file => file.path), // Salva i percorsi dei file caricati
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// Endpoint per ottenere un prodotto
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante il recupero del prodotto' });
  }
});

// Endpoint per modificare un prodotto
app.put('/api/products/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del prodotto' });
  }
});

// Endpoint per eliminare un prodotto
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Prodotto non trovato' });
    res.status(200).json({ message: 'Prodotto eliminato con successo' });
  } catch (err) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione del prodotto' });
  }
});

// Utilizzo delle rotte
app.use('/api', authRouter); // Rotte di autenticazione
app.use('/api', productRouter); // Rotte dei prodotti
app.use('/api', orderRouter); // Utilizzo del router per gli ordini

// Avvio del server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});

// Debug mode
if (process.env.DEBUG === 'true') {
  console.log('Debug mode attivo');
}

// Mostra variabili d'ambiente per debug
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI);
