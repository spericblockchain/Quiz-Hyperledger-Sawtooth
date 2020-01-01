/*
module to deal with writing data to State , address generation ,hashing etc
*/

const crypto = require('crypto'),
	{ TextEncoder } = require('text-encoding/lib/encoding'),
	{ Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1'),
	{ createContext, CryptoFactory } = require('sawtooth-sdk/signing'),
	encoder = new TextEncoder('utf8')

class tpFun {
	hash(data) {
		return crypto
			.createHash('sha512')
			.update(data)
			.digest('hex')
	}
	writeToState(context, address, data) {
		this.dataBytes = encoder.encode(JSON.stringify(data))
		const entries = {
			[address]: this.dataBytes
		}
		return context.setState(entries)
	}
	deleteFromState(context, address) {
		return context.deleteState([address])
	}
	getUserAddress(nameHash, section, publicKey, extra = null) {
		const sectionHash = this.hash(section),
			keyHash = this.hash(publicKey)
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
	getUserPublicKey(Key) {
		const context = createContext('secp256k1'),
			key = Secp256k1PrivateKey.fromHex(Key),
			signer = new CryptoFactory(context).newSigner(key)
		return signer.getPublicKey().asHex()
	}
}

module.exports = tpFun
