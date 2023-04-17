import React, { useState } from "react";
import { useSession } from "next-auth/client";
import DropIn from "braintree-web-drop-in-react";
import { toast } from "react-toastify";
import { config } from "../config";

const Product = () => {
  const [session] = useSession();
  const [clientToken, setClientToken] = useState(null);
  const [showDropIn, setShowDropIn] = useState(false);
  const [nonce, setNonce] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { nonce } = await dropinInstance.requestPaymentMethod();
      setNonce(nonce);
      setLoading(false);
      toast.success("Payment successful!");
      // Add code to submit the nonce to your backend for processing
    } catch (error) {
      setLoading(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowDropIn(false);
  };

  const handleReady = async (instance) => {
    dropinInstance = instance;
  };

  let dropinInstance;

  const loadBraintreeClientToken = async () => {
    try {
      const response = await fetch("/api/braintree/token");
      if (response.ok) {
        const { clientToken } = await response.json();
        setClientToken(clientToken);
      } else {
        throw new Error("Failed to load Braintree client token");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load Braintree client token");
    }
  };

  React.useEffect(() => {
    if (session) {
      loadBraintreeClientToken();
    }
  }, [session]);

  if (!session) {
    return <div>Please sign in to view this page.</div>;
  }

  return (
    <div>
      <h1>Product Page</h1>
      <p>Product Details</p>
      <button onClick={() => setShowDropIn(true)}>Checkout</button>
      {showDropIn && (
        <div>
          <DropIn
            options={{ authorization: clientToken }}
            onInstance={handleReady}
          />
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
