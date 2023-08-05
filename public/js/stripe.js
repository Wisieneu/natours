/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51NbU4vKbuSCNv8Tw90RiwBeTNE8bHW7w604JvPzoQc4TbNhes5k6DctTkkFy07kvLn5qhA2lweVbgSO5GRhWaWwb00DMEA8Oaa'
);
export const bookTour = async (tourId) => {
  // Get the session from the server
  try {
    const session = await axios(
      `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(session);

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.error(err);
    showAlert('error', err);
  }
  // Create checkout form + charge credit card
};
