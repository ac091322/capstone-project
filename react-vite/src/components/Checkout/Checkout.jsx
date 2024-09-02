import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { FaUnlockKeyhole } from "react-icons/fa6";
import { thunkShoppingCartUserGet } from "../../redux/shoppingCart";
import Confirmation from "./Confirmation";
import "./Checkout.css";


function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.session.user);
  const shoppingCartId = currentUser ? currentUser.shopping_cart?.[0]?.id : null;
  const shoppingCartObj = useSelector(state => state.shoppingCart);
  const shoppingCart = Object.values(shoppingCartObj);
  const myShoppingCart = shoppingCart?.filter(shoppingCart => shoppingCart.shopping_cart_id === +shoppingCartId);

  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate("/");
    if (currentUser) dispatch(thunkShoppingCartUserGet(shoppingCartId));
    if (currentUser && myShoppingCart?.length === 0) navigate("/");
  }, [currentUser, shoppingCartId, navigate]);

  useEffect(() => {
    dispatch(thunkShoppingCartUserGet(shoppingCartId));
  }, [dispatch, shoppingCartId]);

  const calculateSubtotal = () => {
    return Array.isArray(myShoppingCart) ? myShoppingCart?.reduce((accum, game) => accum + parseFloat(game.price), 0) : 0;
  };

  const taxRate = 0.0725;
  const subTotal = calculateSubtotal();
  const salesTax = subTotal * taxRate;
  const total = subTotal + salesTax;

  const formattedCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formattedSubtotal = formattedCurrency(subTotal);
  const formattedSalesTax = formattedCurrency(salesTax);
  const formattedTotal = formattedCurrency(total);

  if (!currentUser) return null;

  return (
    <section id="container-checkout-page">
      <div id="container-checkout-page-inner">

        <div id="container-checkout-page-inner-left">
          {confirmation ? <Confirmation /> :
            (<>
              <div id="container-title-checkout">
                <h1>Checkout</h1>
                <span style={{
                  paddingTop: "5px",
                  color: "var(--logo-color)",
                  fontSize: "13px"
                }}>step 1 of 2</span>
              </div>

              <p>To finalize the tax and total, please provide your billing location:</p>

              <div id="container-location-checkout">
                <label className="container-local-fields-checkout">
                  Country
                  <select>
                    <option>United States</option>
                  </select>
                </label>

                <label className="container-local-fields-checkout">
                  State
                  <select>
                    <option>California</option>
                  </select>
                </label>

                <label className="container-local-fields-checkout">
                  Zip code
                  <input
                    type="number"
                    min="10000"
                    max="99950"
                    value="94587"
                    readOnly
                  />
                </label>
              </div>

              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                marginBottom: "20px"
              }}>
                {myShoppingCart?.map(cartItem => (
                  <div
                    key={cartItem.game_id}
                    id="container-games-in-shopping-cart"
                  >
                    <span>{cartItem.game_title}</span>
                    <span>{cartItem.price}</span>
                  </div>
                ))}
              </div>

              <div id="container-cost-calculations-checkout">
                <div id="container-price-titles">
                  <span>subtotal</span>
                  <span>sales tax (7.25%)</span>
                  <span>total</span>
                </div>

                <div id="container-price-values">
                  <span>{formattedSubtotal} USD</span>
                  <span>{formattedSalesTax} USD</span>
                  <span>{formattedTotal} USD</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setConfirmation(true)}
              >
                Confirm Purchase
              </button>
              <button
                type="button"
                onClick={() => { navigate(-1, { replace: true }) }}
              >
                Back
              </button>

              <span id="disclaimer-checkout"
                style={{ fontSize: "0.75rem" }}
              >
                <FaUnlockKeyhole /> This is a NON-secure, TLS-encrypted transaction.
              </span>
            </>)}
        </div>

      </div>
    </section>
  );
}


export default Checkout;
