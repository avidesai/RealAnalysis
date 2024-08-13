const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

// Initialize Stripe with your secret key
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); // Ensure STRIPE_SECRET_KEY is set in your .env file

router.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1PnCu5J2kDTu2wEea77zpI4b', // Replace with your actual price ID
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/', // Replace with your actual success URL
      cancel_url: 'http://localhost:3000/',   // Replace with your actual cancel URL
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send(`Error creating checkout session: ${error.message}`);
  }
});

module.exports = router;
