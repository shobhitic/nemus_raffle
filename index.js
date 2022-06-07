const ethers = require('ethers')
const snapshot = require('./snap.js')
const lodash = require("lodash")
const {load} = require('csv-load-sync');

var original_addresses = [];

if (!!!process.argv[2]) {
  console.log("please send CSV file as argument")
  return
}

var addresses = []
var winners = [];

var citydao = '0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb'
var abi = [{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}]

var provider = new ethers.providers.JsonRpcProvider("https://cloudflare-eth.com/") // Replace with infura or other reliable provider
var contract = new ethers.Contract(citydao, abi, provider);

const convertToAddress = async (name) => {
  return (await provider.resolveName(name.trim())).toLowerCase()
}

const convertToName = async (address) => {
  var name = await provider.lookupAddress(address);
  return name || address;
}

const processAddresses = async () => {
  var addresses = [];
  for (var i = 0; i < original_addresses.length; i++) {
    if (original_addresses[i].address) {
      var address = await convertToAddress(original_addresses[i].address) // convert names to addresses
      addresses.push(address)
    }
  }

  unique_addresses = lodash.uniq(addresses.map((x) => {return x.toLowerCase()})); // dedup the addresses.
  await calculateWinners()
}


const calculateWinners = async () => {
  for (var i = 0; i < 125; i++) {
    var winner = false;
    var index = Math.floor(Math.random() * unique_addresses.length);
    var address = unique_addresses[index];
    var scores = await snapshot.getScores(address);
    var score = scores.reduce(((total, score) => score[address]), 0)

    if (scores[0][address] > 0 || scores[1][address] > 0 || scores[2][address] > 0) {
      // Address has voted on snapshot.

      balances = await contract.balanceOfBatch([address, address, address], [7, 42, 69]);
      if (balances[0].gt(0) || balances[1].gt(0) || balances[2].gt(0)) {
        // Address owns a city DAO NFT

        console.log(await convertToName(address))
        winners.push(address)
        winner = true
      }
    }

    if (!winner) {
      i--;
    }

    unique_addresses.splice(index, 1);
  }
}


original_addresses = load(process.argv[2]); // load csv file
processAddresses() // run the main function
