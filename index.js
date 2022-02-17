import {
  resolveToWalletAddress,
  getParsedNftAccountsByOwner,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import express from "express";

var app = express();
const port = process.env.PORT || 3000;

const getAllNftData = async (token) => {
  try {
    

    const publicAddress = await resolveToWalletAddress({
      text: token,
    });

    const nftArray = await getParsedNftAccountsByOwner({
      publicAddress,
    });

    // console.log(nftArray)

    return nftArray;
  } catch (error) {
    console.log(error);
  }
};

const getNftTokenData = async (token) => {
  try {
    let nftData = await getAllNftData(token);
    var data = nftData
    //  Object.keys(nftData).map((key) => nftData[key]);
    let arr = [];
    let n = data.length;
    let obj = {};
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      obj[data[i].data["symbol"]] =
        obj[data[i].data["symbol"]] && obj[data[i].data["symbol"]].length > 0
          ? [...obj[data[i].data["symbol"]], val.data]
          : [val.data];
          // console.log(val)
    }
    console.log(obj);
    return obj;
  } catch (error) {
    console.log(error);
  }
};
getNftTokenData("7oAw3KSBeuuXb4p6KZL2BmnHbnXUzoF8dxAkXTMbMaiP");

app.get("/:token", async (req, res) => {
  let response = await getAllNftData(req.params.token);
  res.send(response);
});

app.listen(port, async (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on ${port}`);
});
