const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connesso: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Errore connessione DB: ${error.message}`);
    process.exit(1); // Esce dall'app se il DB non si connette
  }
};

module.exports = connectDB;
