async function initiatePhonePePayment(totalAmount) {
  try {
    const tokenResponse = await fetch(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_version: 1,
          grant_type: "client_credentials",
          client_id: "M23SDLRCTHQGZ_2512071520",
          client_secret: "YOUR_SECRET_HERE",
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const paymentResponse = await fetch(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          expireAfter: 1200,
          merchantOrderId: "ORDER_" + Date.now(),
          paymentFlow: {
            type: "PG_CHECKOUT",
            message: "Orange Delivery Order Payment",
            merchantUrls: {
              redirectUrl: "https://yourwebsite.com/payment-success.html",
            },
          },
        }),
      }
    );

    const paymentData = await paymentResponse.json();

    if (paymentData.redirectUrl) {
      window.location.href = paymentData.redirectUrl;
    } else {
      alert("Payment initiation failed!");
    }
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Something went wrong while initiating payment.");
  }
}
