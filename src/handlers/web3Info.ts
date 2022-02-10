const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')
const ethers = require('ethers')
const alchemyRopstenApiKey = 'w3uaV-Uf9_B2V29A3diMdQsYNy883Xsr'
const address = '0xb848A5aC740a6C76C102B161a88e847d88a69e91'
const raffleWinners = {
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266': 1,
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8': 1,
  '0xBf06cec47bc981ab9f0522BC053A198acA644ac8': 1,
  '0xF8087d77e8B0A9E9598a13e420b1D7AF1217b109': 1,
  '0xb848a5ac740a6c76c102b161a88e847d88a69e91': 1,
}
const bodySupply =
  '{"jsonrpc": "2.0","id": 0,"method": "eth_call","params": [{"from": "0xBf06cec47bc981ab9f0522BC053A198acA644ac8","to": "0x5C67A067c31Ff03A0fC3Ab05a40dB3bad91c21D2","data": "0x18160ddd"},"latest"]}'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Content-type': 'application/json',
}

function hashToken(account, amount) {
  return Buffer.from(
    ethers.utils
      .solidityKeccak256(["address", "uint256"], [account, amount])
      .slice(2),
    "hex"
  );
}


export const Balance = async (request) => {
  const address = request.params.address
  if (address == '') {
    new Response('Invalid address', { status: 401 })
  }
  const bodyBalance =
    '{"jsonrpc":"2.0","method":"eth_getBalance","params":["' +
    address +
    '", "latest"],"id":0}'
  const data = await sendRequest(bodyBalance)
  const balance = {
    address: address,
    balance: parseInt(data.result, 16) / 1000000000000000000,
  }
  ADDRESS_STORE.put(balance.address, JSON.stringify(balance))
  ADDRESS_STORE.put("raffleWinners", JSON.stringify(raffleWinners["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"]))
  return new Response(JSON.stringify(balance), { headers })
}

export const Supply = async (request) => {
  const data = await sendRequest(bodySupply)
  const supply = {
    supply: parseInt(data.result, 16),
  }
  return new Response(JSON.stringify(supply), { headers })
}

export const RaffleRoot = async (request) => {
const rafflehash = Object.entries(raffleWinners).map((token) =>
hashToken(...token)
);
  const raffleTree = new MerkleTree(rafflehash, keccak256, { sortPairs: true });
const raffleRoot = raffleTree.getHexRoot();
  return new Response(raffleRoot, { headers })
}
async function sendRequest(body: string) {
  const alchemyEndpoint =
    'https://eth-ropsten.alchemyapi.io/v2/' + alchemyRopstenApiKey
  const requestEth = {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: body,
  }
  const responseEth = await fetch(alchemyEndpoint, requestEth)
  const data = await responseEth.json()
  return data
}
