import express, { response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import axiosApi from "./src/services/axios";

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// parse cookie
app.use(cookieParser());

app.get("/", async (req, res) => {
  return await axiosApi
    .get("/status")
    .then((data) => {
      // console.log("data", data);
      return res.send(`we are here  : ${data}`);
    })
    .catch((e) => {
      // console.log({ ...e });
      return res.send(`we have errro ${e}`);
    });
});

app.get("/currencies", async (req, res) => {
  return axiosApi({
    method: "GET",
    url: "/currencies",
  })
    .then((response) => {
      return res.json(response.data);
    })
    .catch((e) => {
      return res.json(e);
    });
});

app.get("/charge", async (req, res) => {
  if (!!req.query?.amount && !!req.query?.currency_from && !!req.query?.currency_to) {
    const { amount, currency_to, currency_from } = req.query;
    axiosApi({
      method: "GET",
      url: "/estimate",
      params: {
        amount,
        currency_from,
        currency_to,
      },
    })
      // we success to get prices
      .then((response) => {
        axiosApi({
          method: "POST",
          url: "/payment",
          data: JSON.stringify({
            price_amount: response.data?.estimated_amount,
            price_currency: response.data?.currency_from,
            pay_amount: response.data?.estimated_amount,
            pay_currency: response.data?.currency_to,
            order_id: "13770116",
            order_description: "birthday :)",
            ipn_callback_url: "http://fiddle.com/callback",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          // we success done payment
          .then((paymentResponse) => {
            // console.log(paymentResponse.data);
            res.json(paymentResponse.data);
          })
          .catch((paymentError) => {
            res.send(paymentError);
          });
      })
      .catch((e) => {
        res.send(e);
      });
  } else {
    res.send("you need pass amount & currency_from & currency_to");
  }
});

app.all("/callback", async (req, res) => {
  console.log("this is request.......", req);
  res.send("hi");
});

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`);
});
