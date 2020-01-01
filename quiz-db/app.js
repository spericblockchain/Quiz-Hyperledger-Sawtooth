const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')
const userRouter = require('./routes/userRouter')()
const adminRouter = require('./routes/adminRouter')()
const app = new express()

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())
app.use(cors())
app.use(bodyparser.json())
app.options('/*', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, Content-Length, X-Requested-With'
	)
	res.sendStatus(200)
})
app.use('/db/user', userRouter)
app.use('/db/admin', adminRouter)
app.listen(3002, function() {
	console.log('listening to port  ' + 3002)
})
