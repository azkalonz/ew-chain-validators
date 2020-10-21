const Web3 = require('web3')

const utils = require('ethereumjs-util')
const BlockHeader = require('ethereumjs-block/header')

const web3 = new Web3(new Web3.providers.HttpProvider('https://rpc.energyweb.org'))

this.interval = setInterval(() => {
    this.web3.eth.getBlock('latest').then((block) => {

        const block = web3.eth.getBlock(2645189, true)

        const dataBuff = utils.toBuffer(block.extraData)
        const sig = utils.fromRpcSig(dataBuff.slice(dataBuff.length - 65, dataBuff.length))
        
        block.extraData = '0x' + utils.toBuffer(block.extraData).slice(0, dataBuff.length - 65).toString('hex')
        
        const headerHash = new BlockHeader({
          parentHash: utils.toBuffer(block.parentHash),
          uncleHash: utils.toBuffer(block.sha3Uncles),
          coinbase: utils.toBuffer(block.miner),
          stateRoot: utils.toBuffer(block.stateRoot),
          transactionsTrie: utils.toBuffer(block.transactionsRoot),
          receiptTrie: utils.toBuffer(block.receiptsRoot),
          bloom: utils.toBuffer(block.logsBloom),
          difficulty: utils.toBuffer(block.difficulty.toNumber()),
          number: utils.toBuffer(block.number),
          gasLimit: utils.toBuffer(block.gasLimit),
          gasUsed: utils.toBuffer(block.gasUsed),
          timestamp: utils.toBuffer(block.timestamp),
          extraData: utils.toBuffer(block.extraData),
          mixHash: utils.toBuffer(block.mixHash),
          nonce: utils.toBuffer(block.nonce)
        })
        
        const pub = utils.ecrecover(headerHash.hash(), sig.v, sig.r, sig.s)
        
        const address = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'))
        
        console.log(headerHash.hash().toString('hex'))
        console.log(address) // returns expected result

    });
}, 5000);