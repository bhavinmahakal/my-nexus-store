//Razorpay Checkout Function
export const initiatePayment = ({ amount, orderId, userInfo, onSuccess, onFailure }) => {
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
