const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

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
    serverSelectionTimeoutMS: 30000, // 30 seconds
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => {
    console.error('DB connection error:', err);
    process.exit(1); // Exit the process with a failure code
  });

// READ JSON FILE
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.error('Error loading data:', err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.error('Error deleting data:', err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log(
    'Invalid command. Use --import to import data or --delete to delete data.',
  );
  process.exit();
}
