import { config } from "../../../config";
import braintree from "braintree";

const gateway = new braintree.BraintreeGateway({
  environment: config.braintree.environment,
  merchantId: config.braintree.merchantId,
  publicKey: config.braintree.publicKey,
  privateKey: config.braintree.privateKey,
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response = await gateway.clientToken.generate({});
      const clientToken = response.clientToken;
      res.status(200).json({ clientToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to generate client token" });
    }
  } else {
    res.status(404).json({ error: "Endpoint not found" });
  }
}
