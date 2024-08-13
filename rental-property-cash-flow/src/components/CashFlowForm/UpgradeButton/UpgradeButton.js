// /UpgradeButton/UpgradeButton.js

import React from 'react';

const UpgradeButton = () => {
  const handleUpgrade = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const session = await response.json();

      if (session.id) {
        window.location.href = `https://checkout.stripe.com/pay/${session.id}`;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during checkout. Please try again.');
    }
  };

  return (
    <button onClick={handleUpgrade} className="premium-button">
      Upgrade to Premium
    </button>
  );
};

export default UpgradeButton;
