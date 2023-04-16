import React from "react";
import { useRouter } from "next/router";
import braintree from "braintree-web";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-toastify";

const Product = () => {
  const [clientToken, setClientToken] = React.useState(null);
  const [showDropIn, setShowDropIn] = React.useState(false);
  const [nonce, setNonce] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const router = useRouter();

  React.useEffect(() => {
    fetch("/api/braintree/token")
      .then((res) => res.json())
      .then((data) => setClientToken(data.clientToken));
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { nonce } = await dropinInstance.requestPaymentMethod();
      setNonce(nonce);
      setLoading(false);
      toast.success("Payment successful!");
      router.push("/");
    } catch (error) {
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleCancel = () => {
    router.push("/");
  };

  const handleReady = async (instance) => {
    dropinInstance = instance;
  };

  let dropinInstance;

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product Details</p>
      <button onClick={() => setShowDropIn(true)}>Checkout</button>
      {showDropIn && (
        <DropIn
          options={{ authorization: clientToken }}
          onInstance={handleReady}
        />
      )}
      {nonce && (
        <div>
          <h2>Nonce:</h2>
          <p>{nonce}</p>
          <button onClick={handleCancel}>Cancel</button>
          <button onClick={handlePayment} disabled={loading}>
            {loading ? "Processing Payment..." : "Submit Payment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Product;
