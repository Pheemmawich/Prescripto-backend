import Stripe from "stripe";
import appointmentModel from "../models/appointmentModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const useWebhook = async (req, res) => {
    console.log('webhook working')

    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
      } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      if (event.type === 'checkout.session.completed') {
        console.log('event', event)
        const session = event.data.object;
        console.log('session', session)
        const appointmentId = session.metadata.appointmentId;
    
        if (!appointmentId) {
          return res.status(400).json({success:false, message: "Missing appointmentId"});
        }
      
        if (session.payment_status !== 'paid') {
          return res.status(400).json({success:false, message: "Payment not completed"});
        }

        try {

          await appointmentModel.updateOne(
  { _id: appointmentId, payment: false }, 
  { $set: { payment: true } }
)
          res.status(200).json({ received: true });
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: error.message });
 
        }
      }
    
      

}

export default useWebhook