import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import express from "express";
import express from "twitter-lite";

var app = express();
const port = process.env.PORT || 3000;
const user = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
});

const getAllNftData = async (token) => {
  try {
    const publicAddress = await resolveToWalletAddress({
      text: token,
    });

    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress,
    });

    return nftArray;
  } catch (error) {
    console.log(error);
  }
};

const getNftTokenData = async (token) => {
  try {
    let nftData = await getAllNftData(token);
    var data = nftData;
    let arr = [];
    let n = data.length;
    let obj = {};
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      obj[data[i].data["symbol"]] =
        obj[data[i].data["symbol"]] && obj[data[i].data["symbol"]].length > 0
          ? [...obj[data[i].data["symbol"]], val.data]
          : [val.data];
    }
    return obj;
  } catch (error) {
    console.log(error);
  }
};

app.get("/:token", async (req, res) => {
  let response = await getNftTokenData(req.params.token);
  res.send(response);
});

app.listen(port, async (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});
