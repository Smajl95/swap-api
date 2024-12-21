const express = require('express');
const { validateOrder } = require('../validators/orderValidator'); 
const Order = require('../models/order'); 
const mongoSanitize = require("express-mongo-sanitize"); 

const router = express.Router();

router.post('/orders', async (req, res) => {
  try {
    // Sanitizza l'input
    mongoSanitize.sanitize(req.body);
    const sanitizedInput = req.body;

    // Valida i dati
    const { error, value } = validateOrder(sanitizedInput);
    if (error) return res.status(400).json({ message: error.details[0].message });

    // Crea un nuovo ordine
    const newOrder = new Order({
      products: value.products,
      user: value.user, // user
      totalAmount: value.totalAmount,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore nella creazione dell\'ordine' });
  }
});


// Modifica di un ordine esistente
router.put('/orders/:id', async (req, res) => {
  try {
    // Sanitizza l'input
    const sanitizedInput = mongoSanitize.sanitize(req.body);

    // Valida i dati
    const { error, value } = validateOrder(sanitizedInput);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'ordine' });
  }
});

// Eliminazione di un ordine
router.delete('/orders/:id', async (req, res) => {
  try {
    const sanitizedId = mongoSanitize.sanitize(req.params.id); // Sanitizza l'ID
    const order = await Order.findByIdAndDelete(sanitizedId);

    if (!order) {
      return res.status(404).json({ message: 'Ordine non trovato' });
    }

    res.status(200).json({ message: 'Ordine eliminato con successo' });
  } catch (error) {
    res.status(500).json({ message: 'Errore durante l\'eliminazione dell\'ordine' });
  }
});

// Visualizzare tutti gli ordini
// GET /orders
router.get('/orders', async (req, res) => {
  try {
    console.log('Query Params:', req.query); // Verifica i parametri ricevuti
    const orders = await Order.find(req.query)
      .populate('products', 'name') // Popola il nome dei prodotti
      .populate('user', 'username'); // Popola il nome dell'utente (o qualsiasi campo esista in `User`)

    res.status(200).json(orders);
  } catch (error) {
    console.error('Errore durante il recupero degli ordini:', error);
    res.status(500).json({ message: 'Errore durante il recupero degli ordini', error: error.message });
  }
});



// Filtrare gli ordini per data di inserimento
router.get('/orders/filter', async (req, res) => {
  try {
    const sanitizedQuery = mongoSanitize.sanitize(req.query); // Sanitizza la query

    const { startDate, endDate } = sanitizedQuery;
    const filter = {};
    if (startDate) filter.createdAt = { $gte: new Date(startDate) };
    if (endDate) {
      filter.createdAt = filter.createdAt || {};
      filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter)
      .populate('products', 'name')
      .populate('user', 'firstName lastName email');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Errore durante il filtraggio degli ordini:', error);
    res.status(500).json({ message: 'Errore durante il filtraggio degli ordini', error: error.message });
  }
});

module.exports = router;
