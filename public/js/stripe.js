/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  const stripe = Stripe(
    'pk_test_51NbU4vKbuSCNv8Tw90RiwBeTNE8bHW7w604JvPzoQc4TbNhes5k6DctTkkFy07kvLn5qhA2lweVbgSO5GRhWaWwb00DMEA8Oaa'
  );
  // Get the session from the server
  try {
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
  // Create checkout form + charge credit card
};
