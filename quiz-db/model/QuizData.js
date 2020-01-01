const mongoose = require('mongoose')
mongoose
	.connect('mongodb://mongo:27017/quiz-db', {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err))

const Schema = mongoose.Schema
const QuizSchema = new Schema({
	quiz: String
	// answer1: String,
	// answer2: String,
	// answer3: String,
	// answer4: String,
	// bestAnswer: String
})
const QuizData = mongoose.model('QuizData', QuizSchema)
module.exports = QuizData
