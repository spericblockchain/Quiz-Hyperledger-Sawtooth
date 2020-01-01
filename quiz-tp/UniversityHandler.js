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
	FAMILY_NAME = 'QUIZ_CHAIN_University',
	NAMESPACE = tp.hash('QuizBlocks').substring(0, 6)

async function AddProfessor(context, address, professor) {
	const state = await context.getState([address])
	let stateData = decoder.decode(state[address])
	if (!stateData) {
		console.log('New Professor')
		const Professor = {
			name: professor.name,
			mobile: professor.mobile,
			subject: professor.subject,
			quizList: []
		}
		const professorStatus = await tp.writeToState(context, address, Professor)
		context.addReceiptData(Buffer.from(professorStatus, 'utf8'))
		return professorStatus
	} else {
		context.addReceiptData(
			Buffer.from('Professor Already Exist on State ' + address, 'utf8')
		)
		throw new InvalidTransaction('Professor Already Exist on State ')
	}
}
async function DeleteProfessor(context, address) {
	const state = await context.getState([address])
	let stateData = decoder.decode(state[address])
	if (!stateData) {
		console.log('No Image found')
	} else {
		const Status = await context.deleteState([address])
		context.addReceiptData(Buffer.from(Status, 'utf8'))
		return Status
	}
}
async function AddStudent(context, address, student) {
	const state = await context.getState([address])
	let stateData = decoder.decode(state[address])
	if (!stateData) {
		const Student = {
			name: student.name,
			mobile: student.mobile,
			subject: student.subject,
			batch: student.batch,
			playedQuiz: []
		}
		const studentStatus = await tp.writeToState(context, address, Student)
		context.addReceiptData(Buffer.from(studentStatus, 'utf8'))
		return studentStatus
	} else {
		context.addReceiptData(
			Buffer.from('Student Already Exist on State ' + address, 'utf8')
		)
		throw new InvalidTransaction('Student Already Exist on State ')
	}
}
async function DeleteStudent(context, address) {
	const state = await context.getState([address])
	let stateData = decoder.decode(state[address])
	if (!stateData) {
		console.log('No Image found')
	} else {
		const Status = await context.deleteState([address])
		context.addReceiptData(Buffer.from(Status, 'utf8'))
		return Status
	}
}
async function QuizSubmit(context, mark, quizAddress, studentaddress) {
	try {
		const studentState = await context.getState([studentaddress]),
			studentStateData = decoder.decode(studentState[studentaddress])
		if (!studentStateData) {
			throw new InvalidTransaction('Invalid Student Address')
		} else {
			const QuizResult = {
				mark: mark,
				quiz: quizAddress
			}
			const studentData = JSON.parse(studentStateData)
			studentData.playedQuiz.push(JSON.stringify(QuizResult))
			const setResultRes = await tp.writeToState(
				context,
				studentaddress,
				studentData
			)
			context.addReceiptData(Buffer.from(setResultRes, 'utf8'))
			return setResultRes
		}
	} catch (error) {
		console.log(error)
	}
}
//transaction handler class

class UniversityHandler extends TransactionHandler {
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
			if (
				userPublicKey ==
				'021f4c1e1e2b2fbe8dde7ecf4fe772d55777e85626ec563846467b34f6a6a02670'
			) {
				switch (Payload[1]) {
					case 'AddProfessor':
						return AddProfessor(
							context,
							tp.getUserAddress(NAMESPACE, '0o00', Payload[0].publicKey),
							Payload[0]
						)
					case 'QuizSubmit':
						return QuizSubmit(context, Payload[0], Payload[2], Payload[3])
					case 'DeleteProfessor':
						return DeleteProfessor(context, Payload[0])
					case 'AddStudent':
						return AddStudent(
							context,
							tp.getUserAddress(NAMESPACE, '0o10', Payload[0].publicKey),
							Payload[0]
						)
					case 'DeleteStudent':
						return DeleteStudent(context, Payload[0])
					default:
						throw new InternalError(' Error! in TP')
				}
			} else {
				throw new InvalidTransaction('Invalid Access')
			}
		} catch (err) {
			throw new InternalError(err)
		}
	}
}

module.exports = UniversityHandler
