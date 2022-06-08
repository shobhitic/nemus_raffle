const ethers    = require('ethers');
const snapshot  = require('./snap.js');
const lodash    = require("lodash");
const {load}    = require('csv-load-sync');
const fs        = require('fs');

if (!!!process.argv[2]) {
  console.log("please send CSV file as argument");
  return;
}

const winners = [];

const citydao = '0x7eef591a6cc0403b9652e98e88476fe1bf31ddeb'; // citydao NFT address
const abi = [{"inputs":[{"internalType":"address[]","name":"accounts","type":"address[]"},{"internalType":"uint256[]","name":"ids","type":"uint256[]"}],"name":"balanceOfBatch","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"}]; // balanceOfBatch ABI

const provider = new ethers.providers.JsonRpcProvider("https://cloudflare-eth.com/"); // Replace with infura or other reliable provider
const contract = new ethers.Contract(citydao, abi, provider);

const convertToAddress = async (name) => {
  // converts the .eth address to resolved address. Returns address itself if name is an address
  const address = await provider.resolveName(name.trim());

  if (address) {
    return address.toLowerCase();
  } else {
    return null;
  }
}

const convertToName = async (address) => {
  // converts address to .eth address if available
  const name = await provider.lookupAddress(address);
  return name || address;
}

const processAddresses = async () => {
  const addresses = [];
  for (var i = 0; i < original_addresses.length; i++) {
    if (original_addresses[i].address) {
      var address = await convertToAddress(original_addresses[i].address); // convert names to addresses

      if (address) {
        addresses.push(address);
      }
    }
  }

  await calculateWinners(addresses);
}


const calculateWinners = async (addresses) => {
  // Randomly calculates 125 winners

  // dedup the addresses.
  const unique_addresses = lodash.uniq(addresses.map((x) => {return x.toLowerCase()}));

  for (var i = 0; i < 5; i++) {
    var winner = false;

    // generate a random number between 0 and length - 1 of unique_addresses array
    var index = Math.floor(Math.random() * unique_addresses.length);

    // find a random address from array based on random index
    var address = unique_addresses[index];

    // get the total votes casted on snapshot
    var scores = await snapshot.getScores(address);

    if (scores[0][address] > 0 || scores[1][address] > 0 || scores[2][address] > 0) {
      // Address has voted on snapshot.

      balances = await contract.balanceOfBatch([address, address, address], [7, 42, 69]);
      if (balances[0].gt(0) || balances[1].gt(0) || balances[2].gt(0)) {
        // Address owns a city DAO NFT

        console.log(await convertToName(address));
        winners.push(address);
        winner = true;
      }
    }

    if (!winner) {
      i--;
    }

    unique_addresses.splice(index, 1);
  }

  const content = "winners\n" + winners.join("\n");
  fs.writeFileSync('./winners.csv', content);
}


const original_addresses = load(process.argv[2]); // load csv file
processAddresses(); // run the main function
