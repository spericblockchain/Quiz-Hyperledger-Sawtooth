/* eslint-disable indent */
/*
module to deal with writing data to State , address generation ,hashing etc
*/

const crypto = require('crypto'),
	{ CryptoFactory, createContext } = require('sawtooth-sdk/signing'),
	protobuf = require('sawtooth-sdk/protobuf'),
	fetch = require('node-fetch'),
	{ Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1'),
	{ TextEncoder } = require('text-encoding/lib/encoding'),
	config = require('../config/config.js'),
	encoder = new TextEncoder('utf8')

class Sawfun {
	hash(data) {
		return crypto
			.createHash('sha512')
			.update(data)
			.digest('hex')
	}
	getSigner(privateKey) {
		const context = createContext('secp256k1'),
			secp256k1pk = Secp256k1PrivateKey.fromHex(privateKey.trim())
		return new CryptoFactory(context).newSigner(secp256k1pk)
	}
	getUserAddress(nameHash, section, publicKey, extra = null) {
		const sectionHash = this.hash(section)
		const keyHash = this.hash(publicKey)
		if (extra) {
			return (
				nameHash.slice(0, 6) +
				sectionHash.slice(0, 6) +
				extra[0].slice(0, 6) +
				extra[1].slice(0, 52)
			)
		}
		return nameHash.slice(0, 6) + sectionHash.slice(0, 6) + keyHash.slice(0, 58)
	}
	async createTransaction(
		familyName,
		inputList,
		outputList,
		signer,
		payload,
		familyVersion = '1.0'
	) {
		const payloadBytes = encoder.encode(payload)
		//create transaction header
		const transactionHeaderBytes = protobuf.TransactionHeader.encode({
			familyName: familyName,
			familyVersion: familyVersion,
			inputs: inputList,
			outputs: outputList,
			signerPublicKey: signer.getPublicKey().asHex(),
			nonce: '' + Math.random(),
			batcherPublicKey: signer.getPublicKey().asHex(),
			dependencies: [],
			payloadSha512: this.hash(payloadBytes)
		}).finish()
		// create transaction
		const transaction = protobuf.Transaction.create({
			header: transactionHeaderBytes,
			headerSignature: signer.sign(transactionHeaderBytes),
			payload: payloadBytes
		})
		const transactions = [transaction]
		//create batch header
		const batchHeaderBytes = protobuf.BatchHeader.encode({
			signerPublicKey: signer.getPublicKey().asHex(),
			transactionIds: transactions.map((txn) => txn.headerSignature)
		}).finish()
		const batchSignature = signer.sign(batchHeaderBytes)
		//create batch
		const batch = protobuf.Batch.create({
			header: batchHeaderBytes,
			headerSignature: batchSignature,
			transactions: transactions
		})
		//create batchlist
		const batchListBytes = protobuf.BatchList.encode({
			batches: [batch]
		}).finish()
		return this.sendTransaction(batchListBytes, batchHeaderBytes)
	}

	/*
function to submit the batchListBytes to validator
*/
	sendTransaction(batchListBytes, batchHeaderBytes) {
		const fetchapi = config.restapi + '/batches'
		const resp = fetch(fetchapi, {
			method: 'POST',
			headers: { 'Content-Type': 'application/octet-stream' },
			body: batchListBytes
		})
		console.log('Log: Sawfun -> sendTransaction -> resp', resp)
		return batchHeaderBytes
		// console.log('response', resp)
	}
	async quizSubmit(payload, action, studentAddress, priv_Key) {
		try {
			const signer = this.getSigner(priv_Key),
				inputAddressList = [studentAddress],
				outputAddressList = [studentAddress]
			switch (action) {
				case 'QuizSubmit':
					// eslint-disable-next-line no-case-declarations
					const res = await this.createTransaction(
						'QUIZ_CHAIN_University',
						inputAddressList,
						outputAddressList,
						signer,
						payload
					)
					return protobuf.BatchHeader.decode(res)
				default:
					break
			}
		} catch (error) {
			console.error(error)
		}
	}
}

module.exports = Sawfun
