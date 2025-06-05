import cors from 'cors';
import { config } from 'dotenv';
// server.js
import express from 'express';
import morgan from 'morgan';

import connectDB from './config/db.js';
import routes from './routes/apiRoutes.js';

config()
connectDB();

const app = express();

// ----- MIDDLEWARE -----
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ----- ROUTES -----


// Root route
app.use('/api', routes);

// export const fetchAll=()=>{
//   return InventoryData.find({});
// }

// fetchAll().then((docs) => {
//   console.log('All inventory rows:', docs);
// }).catch((err) => {
//   console.error(err);
// });


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

});
