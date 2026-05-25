export const initiatePayment = ({ amount, userInfo, onSuccess, onFailure }) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: "INR",
    name: "ZROM",
    description: "Street. Style. Culture.",
    handler: function (response) {
      onSuccess(response);
    },
    theme: {
      color: "#ff4d1c",
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