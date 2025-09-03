// config/stripe.js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51S3D2tCpQ4ZVMJbCsYRCbMVm4Aqm7jSHTmZdIhbVyifEYLIPlciXZVAf7J9sUIzYcRSiLwq0ym4WKR5S1pbr3C5300bvybniMD');

export default stripePromise;
