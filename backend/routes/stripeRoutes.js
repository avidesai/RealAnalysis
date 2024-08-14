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
          price: 'price_1PnZKeJ2kDTu2wEePacZklpC', // Updated price ID
          quantity: 1,
        },
      ],
      success_url: 'http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}', // Redirect to frontend success page
      cancel_url: 'http://localhost:3000/', // Redirect to frontend home page on cancel
      customer_email: req.user.email,
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).send(`Error creating checkout session: ${error.message}`);
  }
});

// Frontend success route on client side should hit this route to update user's premium status
router.get('/success', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    const user = await User.findOne({ email: session.customer_email });
    if (user) {
      user.premiumStatus = true;
      await user.save();
      return res.redirect('http://localhost:3000/'); // Redirect to home page
    } else {
      return res.redirect('http://localhost:3000/');
    }
  } catch (error) {
    console.error('Stripe success webhook error:', error);
    res.status(500).send('Something went wrong with the payment.');
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const user = await User.findOne({ email: session.customer_email });
      if (user) {
        user.premiumStatus = true;
        await user.save();
      }
    } catch (error) {
      console.error('Error updating user premium status:', error);
      return res.sendStatus(500);
    }
  }

  res.sendStatus(200);
});


module.exports = router;
