const express = require('express');
const User = require('../models/user');  // Modello User
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');  // Libreria per la validazione
const mongoSanitize = require('express-mongo-sanitize'); // Sanitizzazione
const router = express.Router();

// Middleware per sanitizzare le richieste
router.use(mongoSanitize());

// Schema di validazione con Joi
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Rotta di registrazione
router.post('/register', async (req, res) => {
  // Validazione dell'input
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { firstName, lastName, email, password } = req.body;

  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'Email già esistente' });
    }

    // Creazione del nuovo utente
    const newUser = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
    });

    await newUser.save();

    res.status(201).json({ message: 'Utente registrato con successo!' });
  } catch (error) {
    console.error('Errore durante la registrazione:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// Rotta di login
router.post('/login', async (req, res) => {
  // Validazione dell'input
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;

  try {
    // Cerca l'utente nel database
    const user = await User.findOne({ email: email.trim() });
    if (!user) {
      return res.status(400).json({ message: 'Utente non trovato' });
    }

    // Verifica della password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenziali errate' });
    }

    // Creazione del token JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login effettuato con successo', token });
  } catch (error) {
    console.error('Errore durante il login:', error);
    res.status(500).json({ message: 'Errore interno del server' });
  }
});

// Rotta GET per ottenere tutti gli utenti
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore nel recupero degli utenti' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('ID richiesto:', id); // Aggiungi questa riga per il debug
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore nel recupero dell\'utente' });
  }
});



// Rotta PUT per aggiornare i dettagli di un utente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    // Aggiorna i campi
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    res.status(200).json({ message: 'Utente aggiornato con successo', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento dell\'utente' });
  }
});


// Rotta DELETE per eliminare un utente
// Per esempio: Cancellazione utente tramite ID
router.delete('/:id', async (req, res) => {
  try {
    // Trova e cancella l'utente tramite ID
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }

    // Usa deleteOne() al posto di remove()
    await User.deleteOne({ _id: req.params.id });

    res.json({ message: 'Utente eliminato con successo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore server' });
  }
});

module.exports = router;