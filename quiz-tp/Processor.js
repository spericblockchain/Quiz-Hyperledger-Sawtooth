'use strict'
//works in strict mode
const { TransactionProcessor } = require('sawtooth-sdk/processor'),
	UniversityHandler = require('./UniversityHandler'),
	ProfessorHandler = require('./ProfessorHandler'),
	address = process.argv[2],
	transactionProcessor = new TransactionProcessor(address)

if (process.argv.length < 3) {
	console.log('missing a validator address')
	process.exit(1)
}

transactionProcessor.addHandler(new UniversityHandler())
transactionProcessor.addHandler(new ProfessorHandler())
transactionProcessor.start()
