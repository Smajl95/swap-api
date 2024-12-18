const bcrypt = require('bcryptjs');

// Password che vuoi criptare
const newPassword = 'password123';

// Genera una nuova password criptata
bcrypt.hash(newPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log('Password criptata:', hash);
});
