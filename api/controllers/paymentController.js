// const { instance } = require("../server.js");
import crypto from 'crypto';
// const crypto = require("crypto");
import Payment from '../models/paymentModel.js';
// const Payment= require("../models/paymentModel");
import Razorpay from 'razorpay';

const Apikey = "rzp_test_mpY3dN2jDrWAYo";
const secrets = "OMEOTcVHcznpii9UMgngu8ts";
const instance = new Razorpay({
  key_id: Apikey,
  key_secret: secrets,
});

export const checkout = async (req, res) => {
    console.log("Payment checkoiut");
    let am=Number(req.body.amount);
  const options = {
    
    amount: 5000,
    // amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

export const paymentVerification = async (req, res) => {
    console.log("Payment verify");
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });
//suno suno suno yha pe frontend pe redirect krna h


    res.redirect(
      `http://localhost:5173/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

