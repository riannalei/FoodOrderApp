import { useContext, useState } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import Input from "./UI/Input";
import { currencyFormatter } from "../util/formatting";
import UserProgressContext from "../store/UserProgressContext";
import Button from "./UI/Button";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);
  const [orderStatus, setOrderStatus] = useState(null); // Add state to handle order status

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
    setOrderStatus(null); // Reset order status on close
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    console.log("Customer Data:", customerData);

    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order: {
            items: cartCtx.items,
            customer: customerData,
          },
        }),
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const responseData = await response.json();
      console.log("Response Data:", responseData);

      setOrderStatus("Order created!"); // Update order status
      cartCtx.clearCart(); // Optionally, clear the cart after successful submission
    } catch (error) {
      console.error("Error submitting order:", error.message);
      setOrderStatus("Failed to submit order"); // Update order status on error
    }
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      {orderStatus ? (
        <div className="confirmation">
          <h2>Thank you for your order!</h2>
          <p>Your order has been successfully placed.</p>
          <Button type="button" onClick={handleClose}>
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Checkout</h2>
          <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

          <Input label="Full Name" type="text" id="name" />
          <Input label="E-Mail Address" type="email" id="email" />
          <Input label="Street" type="text" id="street" />
          <div className="control-row">
            <Input label="Postal Code" type="text" id="postal-code" />
            <Input label="City" type="text" id="city" />
          </div>

          <p className="modal-actions">
            <Button type="button" textOnly onClick={handleClose}>
              Close
            </Button>
            <Button type="submit">Submit Order</Button>
          </p>
        </form>
      )}
    </Modal>
  );
}
