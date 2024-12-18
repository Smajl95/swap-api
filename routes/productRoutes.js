const express = require("express");
const multer = require("multer");
const Product = require("../models/product");
const mongoSanitize = require("express-mongo-sanitize"); // Per la sanificazione contro NoSQL injection
const router = express.Router();

// Configurazione di multer per gestire l'upload delle foto
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/product-images"); // Cartella per i file caricati
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Timestamp per evitare conflitti
  },
});

const upload = multer({ storage });

// Usa express-mongo-sanitize come middleware per sanificare l'input
router.use(mongoSanitize());

// Endpoint per aggiungere un prodotto
router.post("/", upload.array("photos[]"), async (req, res) => {
  const { name } = req.body;
  const photos = req.files;

  if (!name || !photos || photos.length === 0) {
    return res.status(400).json({ message: "Nome prodotto e foto sono richiesti." });
  }

  try {
    const newProduct = new Product({
      name,
      photos: photos.map(file => file.path), // Percorsi delle immagini caricate
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nel salvataggio del prodotto." });
  }
});

router.get("/", async (req, res) => {
  console.log("GET /api/products - Recupero tutti i prodotti");
  try {
    const products = await Product.find();
    console.log("Prodotti trovati:", products); // DEBUG
    res.status(200).json(products);
  } catch (error) {
    console.error("Errore durante il recupero di tutti i prodotti:", error);
    res.status(500).json({ message: "Errore nel recupero dei prodotti." });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`GET /api/products/${id} - Recupero prodotto specifico`);
  try {
    const product = await Product.findById(id);
    if (!product) {
      console.log(`Prodotto con ID ${id} non trovato`);
      return res.status(404).json({ message: "Prodotto non trovato." });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Errore durante il recupero di un prodotto:", error);
    res.status(500).json({ message: "Errore nel recupero del prodotto." });
  }
});


// Endpoint PUT per aggiornare un prodotto
router.put("/:id", upload.array("photos[]"), async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const photos = req.files;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Prodotto non trovato." });
    }

    product.name = name || product.name;
    if (photos && photos.length > 0) {
      product.photos = photos.map(file => file.path);
    }

    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'aggiornamento del prodotto." });
  }
});

// Endpoint DELETE per rimuovere un prodotto
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Prodotto non trovato." });
    }

    await product.remove();
    res.status(200).json({ message: "Prodotto eliminato." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Errore nell'eliminazione del prodotto." });
  }
});

module.exports = router;

