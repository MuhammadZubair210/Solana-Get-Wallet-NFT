import { clusterApiUrl } from "@solana/web3.js";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import express from "express";

var app = express();
const port = 3000;

const getAllNftData = async (token) => {
  try {
    const connect = createConnectionConfig(clusterApiUrl("mainnet-beta"));
    let ownerToken = token;
    const result = isValidSolanaAddress(ownerToken);
    const nfts = await getParsedNftAccountsByOwner({
      publicAddress: ownerToken,
      connection: connect,
      serialization: true,
    });
    return nfts;
    // }
  } catch (error) {
    console.log(error);
  }
};

const getNftTokenData = async (token) => {
  try {
    let nftData = await getAllNftData(token);
    var data = Object.keys(nftData).map((key) => nftData[key]);
    let arr = [];
    let n = data.length;
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      arr.push(val.data);
    }
    return arr;
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
