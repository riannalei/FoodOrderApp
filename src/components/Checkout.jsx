import { useContext } from "react";
import Modal from "./UI/Modal";
import CartContext from "../store/CartContext";
import Input from "./UI/Input";
import { currencyFormatter } from "../util/formatting";
import UserProgressContext from "../store/UserProgressContext";

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries());

    fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Cotent-Type": "application/json",
      },
      body: JSON.stringify({
        order: {
          items: cartCtx.items,
          customer: customerData,
        },
      }),
    });
  }

  return (
    <Modal open={userProgressCtx.progress === "checkout"} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

        <Input name="Full Name" type="text" id="name" />
        <Input name="E-Mail Adress" type="email" id="email" />
        <Input name="Street" type="text" id="street" />
        <div className="control-row">
          <Input name="Postal Code" type="text" id="postal-code" />
          <Input name="City" type="text" id="city" />
        </div>

        <p className="modal-actions">
          <Buttton type="button" textOnly onClick={handleClose}>
            Close
          </Buttton>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}