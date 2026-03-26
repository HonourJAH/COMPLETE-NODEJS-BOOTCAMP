const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE_URL.replace(
  '<DATABASE_PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// CONNECT TO MONGODB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1);
  });

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
