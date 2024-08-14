// stripeRoutes.js

const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1PnCu5J2kDTu2wEea77zpI4b',
          quantity: 1,
        },
      ],
      success_url: `http://localhost:8000/api/stripe/success?session_id={CHECKOUT_SESSION_ID}`, // Webhook to handle success
      cancel_url: 'http://localhost:3000/',
      customer_email: req.user.email,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send(`Error creating checkout session: ${error.message}`);
  }
});

router.get('/success', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    const user = await User.findOne({ email: session.customer_email });
    if (user) {
      user.premiumStatus = true;
      await user.save();
      return res.redirect('http://localhost:3000/');
    } else {
      return res.redirect('http://localhost:3000/');
    }
  } catch (error) {
    console.error('Stripe success webhook error:', error);
    res.status(500).send('Something went wrong with the payment.');
  }
});

module.exports = router;
