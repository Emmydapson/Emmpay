import express from 'express';
import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoute.js';
import billPaymentRoutes from './src/routes/billPaymentRoutes.js';
import walletRoute from './src/routes/walletRoute.js';
import virtualCardRoute from './src/routes/virtualCardRoutes.js'
import profileRoute from './src/routes/profileRoute.js'

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/virtual-cards', virtualCardRoute);
app.use('/api/auth', authRoutes);
app.use('/api/bill-payment', billPaymentRoutes);
app.use('/api/wallet', walletRoute);
app.use('/api/profile', profileRoute);

// Default route for root path
app.get('/', (req, res) => {
    res.send('Server is up and running.');
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
