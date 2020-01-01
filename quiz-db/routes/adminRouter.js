const express = require('express'),
	QuizData = require('../model/QuizData'),
	adminRouter = express.Router(),
	Sawfun = require('./sawtoothService'),
	saw = new Sawfun(),
	config = require('../config/config.js'),
	priv_Key = config.priv_Key,
	router = () => {
		adminRouter.get('/get', (req, res) => {
			QuizData.find().then((quizs) => {
				res.send(quizs)
			})
		})
		adminRouter.post('/add', (req, res) => {
			try {
				const quiz = req.body.quiz,
					newQuiz = new QuizData(quiz)
				newQuiz.save().then(() => res.json([newQuiz._id, 1]))
			} catch (error) {
				console.log('Log: /add router -> error', error)
			}
		})
		adminRouter.post('/calculate', async (req, res) => {
			try {
				const quizData = req.body.quiz,
					answers = req.body.answer,
					studentAddress = req.body.studentAddress,
					Quiz = await QuizData.findById(quizData.id)
				if (saw.hash(Quiz.quiz) === quizData.hash) {
					const qus = JSON.parse(Quiz.quiz)
					let mark = 0
					qus.forEach((question, i) => {
						if (question.bestAnswer == answers[i]) {
							mark = mark + 1
						}
					})
					const response = await saw.quizSubmit(
						JSON.stringify([
							mark,
							'QuizSubmit',
							quizData.address,
							studentAddress
						]),
						'QuizSubmit',
						studentAddress,
						priv_Key
					)
					res.json(response)
				}
			} catch (error) {
				console.log('Log: /add router -> error', error)
			}
		})
		adminRouter.get('/getByid/:id', async (req, res) => {
			try {
				const data = await QuizData.findById(req.params.id)
				res.json(data.quiz)
			} catch (error) {
				console.log('Log: router -> error', error)
			}
		})
		adminRouter.route('/delete/:id').get((req, res) => {
			QuizData.findByIdAndRemove({ _id: req.params.id }, (err) => {
				if (err) res.json(err)
				else res.json('Removed successfully')
			})
		})
		return adminRouter
	}
module.exports = router
