//Razorpay Checkout Function
export const initiateRazorpayPayment = ({ amount, orderId, userInfo, onSuccess, onFailure }) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID, // .env mein daalo
    amount: amount * 100, // paise mein hona chahiye
    currency: "INR",
    name: "ZROM",
    description: "Street. Style. Culture.",
    image: "/logo.png", // apna logo
    order_id: orderId,  // backend se aayega (optional for test)

    handler: function (response) {
      // Payment success
      onSuccess(response);
    },

    prefill: {
      name: userInfo.name,
      email: userInfo.email,
      contact: userInfo.phone,
    },

    theme: {
      color: "#000000", // ZROM ka black theme
    },

    modal: {
      ondismiss: function () {
        onFailure("Payment cancelled by user");
      },
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.on("payment.failed", function (response) {
    onFailure(response.error.description);
  });

  rzp.open();
};

//Checkout Page mein use karo
import { initiateRazorpayPayment } from "../utils/razorpay";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const handlePayment = async () => {
  const user = auth.currentUser;

  initiateRazorpayPayment({
    amount: totalAmount,       // cart total
    orderId: null,             // test mode mein null chalega
    userInfo: {
      name: user.displayName,
      email: user.email,
      phone: "9999999999",     // form se lena
    },

    onSuccess: async (response) => {
      // Firestore mein order save karo
      await addDoc(collection(db, "orders"), {
        userId: user.uid,
        items: cartItems,
        amount: totalAmount,
        paymentId: response.razorpay_payment_id,
        status: "confirmed",
        createdAt: serverTimestamp(),
      });

      // Cart clear karo
      dispatch({ type: "CLEAR_CART" });

      // Success page pe redirect
      navigate("/order-success");
    },

    onFailure: (error) => {
      console.error("Payment failed:", error);
      alert("Payment failed! Try again.");
    },
  });
};