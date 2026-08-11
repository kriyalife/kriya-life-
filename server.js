import express from "express";
import path from "path";
import crypto from "crypto";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_TOR78pOvdbvvqI';
  const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'mL3a3hwConxvjn1wlF2OluHa';

  // Razorpay Create Order Endpoint
  app.post('/api/razorpay/create-order', async (req, res) => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;
      const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount)), // in paise
          currency,
          receipt: receipt || `rec_${Date.now()}`,
          notes: notes || {}
        })
      });

      const data = await response.json();
      if (!response.ok) {
        return res.status(response.status).json({ error: data.error?.description || 'Razorpay order creation failed' });
      }

      return res.json({
        ...data,
        key_id: RAZORPAY_KEY_ID
      });
    } catch (err) {
      console.error('Razorpay Create Order Error:', err);
      return res.status(500).json({ error: err.message || 'Server error creating Razorpay order' });
    }
  });

  // Razorpay Payment Verification Endpoint
  app.post('/api/razorpay/verify-payment', (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Missing payment verification details' });
      }

      const generated_signature = crypto
        .createHmac('sha256', RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generated_signature === razorpay_signature) {
        return res.json({ success: true, message: 'Payment verified successfully', payment_id: razorpay_payment_id });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid payment signature' });
      }
    } catch (err) {
      console.error('Razorpay Verification Error:', err);
      return res.status(500).json({ success: false, message: 'Server verification error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
