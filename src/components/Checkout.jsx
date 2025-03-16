import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import axios from "axios";
import TableProduct from "./TableProduct";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, userAddress, url, user, clearCart } = useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let qty = 0;
    let price = 0;
    if (cart?.items) {
      for (let i = 0; i < cart.items?.length; i++) {
        qty += cart.items[i].qty;
        price += cart.items[i].price;
      }
    }
    setPrice(price);
    setQty(qty);
  }, [cart]);

  const handlePayment = async () => {
    try {
      console.log("Starting payment process...");
      console.log("Cart items:", cart?.items);
      console.log("User address:", userAddress);
      
      if (!cart?.items || cart.items.length === 0) {
        console.error("No items in cart");
        alert("Your cart is empty. Please add items to your cart before checkout.");
        return;
      }
      
      if (!userAddress) {
        console.error("No shipping address provided");
        alert("Please add a shipping address before checkout.");
        return;
      }
      
      const orderRepons = await axios.post(`${url}/payment/checkout`, {
        amount: price,
        qty: qty,
        cartItems: cart?.items,
        userShipping: userAddress,
        userId: user._id,
      });

      console.log("Order response:", orderRepons.data);
      const { orderId, amount: orderAmount } = orderRepons.data;

      if (!orderId) {
        console.error("No order ID received from server");
        alert("There was a problem creating your order. Please try again.");
        return;
      }

      var options = {
        key: "rzp_test_9hY3pZdhEhHxkW", // Updated to match the key in .env file
        amount: orderAmount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Web Dev Mastery",
        description: "Web Dev Mastery",

        order_id: orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying...", response);
            
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              console.error("Missing payment verification details");
              alert("Payment verification failed. Please try again.");
              return;
            }
            
            const paymentData = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: orderAmount,
              orderItems: cart?.items,
              userId: user._id,
              userShipping: userAddress,
            };

            console.log("Sending verification data:", paymentData);
            const api = await axios.post(
              `${url}/payment/verify-payment`,
              paymentData
            );

            console.log("Verification response:", api.data);

            if (api.data.success) {
              clearCart();
              navigate("/oderconfirmation");
            } else {
              console.error("Payment verification failed");
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error in payment handler:", error);
            alert("There was a problem processing your payment. Please try again.");
          }
        },
        prefill: {
          name: user?.name || "Web Dev Mastery",
          email: user?.email || "webdevmastery@gmail.com",
          contact: "9000090000",
        },
        notes: {
          address: userAddress?.address || "Vijay Nagar Indore",
        },
        theme: {
          color: "#3399cc",
        },
      };
      
      console.log("Opening Razorpay with options:", options);
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      console.error("Error in handlePayment:", error);
      alert("There was a problem initiating the payment. Please try again.");
    }
  };

  return (
    <>
      <div className="container  my-3">
        <h1 className="text-center">Order Summary</h1>

        <table className="table table-bordered border-primary bg-dark">
          <thead className="bg-dark">
            <tr>
              <th scope="col" className="bg-dark text-light text-center">
                Product Details
              </th>

              <th scope="col" className="bg-dark text-light text-center">
                Shipping Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-dark">
            <tr>
              <td className="bg-dark text-light">
                <TableProduct cart={cart} />
              </td>
              <td className="bg-dark text-light">
                <ul style={{ fontWeight: "bold" }}>
                  <li>Name : {userAddress?.fullName}</li>
                  <li>Phone : {userAddress?.phoneNumber}</li>
                  <li>Country : {userAddress?.country}</li>
                  <li>State : {userAddress?.state}</li>
                  <li>PinCode : {userAddress?.pincode}</li>
                  <li>Near By : {userAddress?.address}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="container text-center my-5">
        <button
          className="btn btn-secondary btn-lg"
          style={{ fontWeight: "bold" }}
          onClick={handlePayment}
        >
          Procced To Pay
        </button>
      </div>
    </>
  );
};

export default Checkout;
