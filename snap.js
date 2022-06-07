var snapshot  = require('@snapshot-labs/snapshot.js');
var client = snapshot.Client712("https://hub.snapshot.org")

var space = "daocity.eth"
var network = '1';

var strategies = [
  {
    name: "erc1155-balance-of",
    params: {
      symbol: "ABC",
      address: "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb",
      tokenId: "42",
      decimals: 0
    }
  },
  {
    name: "erc1155-balance-of",
    params: {
      symbol: "ABC",
      address: "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb",
      tokenId: "69",
      decimals: 0
    }
  },
  {
    name: "erc1155-balance-of",
    params: {
      symbol: "ABC",
      address: "0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb",
      tokenId: "7",
      decimals: 0
    }
  },
];
var network = '1';

// var blockNumber = 11437846;
function getScores(voter) {
  return snapshot.utils.getScores(
    space,
    strategies,
    network,
    [voter],
    'latest'
  )
}

module.exports = {getScores};