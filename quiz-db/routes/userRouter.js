const express = require('express'),
	QuizData = require('../model/QuizData'),
	Sawfun = require('./sawtoothService'),
	saw = new Sawfun(),
	userRouter = express.Router(),
	router = () => {
		userRouter.get('/get', (req, res) => {
			QuizData.find().then((quizs) => {
				res.send(quizs)
			})
		})

		userRouter.post('/getByid', async (req, res) => {
			try {
				const data = req.body.quizHashList,
					parsedData = JSON.parse(data.list)
				let qus = []
				parsedData.forEach(async (quiz, i) => {
					const currentQuiz = await QuizData.findById(quiz.id)
					if (saw.hash(currentQuiz.quiz) === quiz.hash) {
						qus[i] = JSON.parse(currentQuiz.quiz)
						qus[i].forEach((q) => {
							delete q.bestAnswer
						})
					}
					if (parsedData.length == i + 1) {
						res.json(qus)
					}
				})
			} catch (error) {
				console.log('Log: error', error)
			}
		})
		return userRouter
	}
module.exports = router
