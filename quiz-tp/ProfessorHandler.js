'use strict'

const { TransactionHandler } = require('sawtooth-sdk/processor/handler'),
	{
		InvalidTransaction,
		InternalError
	} = require('sawtooth-sdk/processor/exceptions'),
	{ TextDecoder } = require('text-encoding/lib/encoding'),
	decoder = new TextDecoder('utf8'),
	tpFun = require('./lib/tpFunctions'),
	tp = new tpFun(),
	FAMILY_NAME = 'QUIZ_CHAIN_Professor',
	NAMESPACE = tp.hash('QuizBlocks').substring(0, 6)
async function NewQuiz(context, address, quiz, professorAddress) {
	try {
		const professorState = await context.getState([professorAddress]),
			professorStateData = decoder.decode(professorState[professorAddress])
		if (!professorStateData) {
			throw new InvalidTransaction('Invalid Professor Address')
		} else {
			const quizState = await context.getState([address])
			let quizStateData = decoder.decode(quizState[address])
			if (!quizStateData) {
				const Quiz = {
					id: quiz.id,
					name: quiz.name,
					batch: quiz.batch,
					hash: quiz.hash
				}
				const setQuizRes = await tp.writeToState(
					context,
					address,
					JSON.stringify(Quiz)
				)
				context.addReceiptData(Buffer.from(setQuizRes, 'utf8'))
				const professorData = JSON.parse(professorStateData)
				professorData.quizList.push(address)
				const setProfessorRes = await tp.writeToState(
					context,
					professorAddress,
					professorData
				)
				context.addReceiptData(Buffer.from(setProfessorRes, 'utf8'))
				return setProfessorRes
			} else {
				throw new InvalidTransaction('Quiz Already Exist on State ')
			}
		}
	} catch (error) {
		console.log(error)
	}
}
//transaction handler class
class ProfessorHandler extends TransactionHandler {
	constructor() {
		super(FAMILY_NAME, ['1.0'], [NAMESPACE])
	}
	//apply function
	apply(transactionProcessRequest, context) {
		try {
			const header = transactionProcessRequest.header,
				PayloadBytes = decoder.decode(transactionProcessRequest.payload),
				Payload = JSON.parse(PayloadBytes),
				userPublicKey = header.signerPublicKey
			switch (Payload[1]) {
				case 'NewQuiz':
					return NewQuiz(
						context,
						tp.getUserAddress(NAMESPACE, '0o11', userPublicKey, [
							tp.hash(Payload[0].batch),
							Payload[0].hash
						]),
						Payload[0],
						tp.getUserAddress(NAMESPACE, '0o00', userPublicKey)
					)
				default:
					throw new InternalError(' Error! in TP')
			}
		} catch (err) {
			throw new InternalError(err)
		}
	}
}

module.exports = ProfessorHandler
