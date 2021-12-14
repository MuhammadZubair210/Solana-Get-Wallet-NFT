import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  getParsedNftAccountsByOwner,
  isValidSolanaAddress,
  createConnectionConfig,
} from "@nfteyez/sol-rayz";
import axios from "axios";
import http from "http";
//create a connection of devnet
const createConnection = () => {
  return new Connection(clusterApiUrl("devnet"));
};

const port = 3000;

const requestHandler = (request, response) => {
  response.end("Hello Node.js Server!");
};

const server = http.createServer(requestHandler);

const getAllNftData = async () => {
  try {
    // if (connectData === true) {
    const connect = createConnectionConfig(clusterApiUrl("mainnet-beta"));
    let ownerToken = "7oAw3KSBeuuXb4p6KZL2BmnHbnXUzoF8dxAkXTMbMaiP";
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

const getNftTokenData = async () => {
  try {
    let nftData = await getAllNftData();
    var data = Object.keys(nftData).map((key) => nftData[key]);
    let arr = [];
    let n = data.length;
    for (let i = 0; i < n; i++) {
      let val = await axios.get(data[i].data.uri);
      console.log(val.data);
      arr.push(val);
    }
    return arr;
  } catch (error) {
    console.log(error);
  }
};

server.listen(port, async (err) => {
  if (err) {
    return console.log("something bad happened", err);
  }

  getNftTokenData();

  console.log(`server is listening on ${port}`);
});
