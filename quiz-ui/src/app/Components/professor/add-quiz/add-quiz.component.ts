import { async } from '@angular/core/testing'
import { QuizModel, QuizDataModel } from './../../../Models/quiz.model'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms'
import { ApiService } from 'src/app/Services/api/api.service'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'
import { UserModel } from 'src/app/Models/user.model'

@Component( {
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: [ './add-quiz.component.scss' ]
} )
export class AddQuizComponent implements OnInit {
  BatchList = [
    'One', 'Two', 'Three', 'Four', 'Five'
  ]
  user: UserModel
  constructor ( private api: ApiService, private fb: FormBuilder, private saw: SawtoothService ) {
    this.user = JSON.parse( localStorage.getItem( 'data' ) )
  }
  quizForm: FormGroup
  get questionForm(): FormArray {
    return this.quizForm.get( 'questions' ) as FormArray
  }

  ngOnInit() {
    this.quizForm = this.fb.group( {
      quizName: new FormControl(),
      questions: this.fb.array( [ new FormGroup( {
        question: new FormControl(),
        answer1: new FormControl(),
        answer2: new FormControl(),
        answer3: new FormControl(),
        answer4: new FormControl(),
        bestAnswer: new FormControl(),
      } ) ] ),
      batch: null
    } )
  }
  addQuiz = () => {
    this.questionForm.push( new FormGroup( {
      question: new FormControl(),
      answer1: new FormControl(),
      answer2: new FormControl(),
      answer3: new FormControl(),
      answer4: new FormControl(),
      bestAnswer: new FormControl(),
    } ) )
  }
  deleteQuiz( i ) {
    this.questionForm.removeAt( i )
  }
  submitQuiz = async () => {
    const quizName = this.quizForm.value.quizName
    const quiz: QuizModel[] = this.quizForm.value.questions
    const quizId = await this.api.sendQuizToDb( quiz )
    const newlySavedQuiz = await this.api.getQuizById( quizId )
    const quizHash = this.saw.hash( JSON.stringify( quiz ) )
    if ( this.saw.hash( newlySavedQuiz ) === quizHash ) {
      const quizData: QuizDataModel = {
        id: quizId,
        name: quizName,
        batch: this.quizForm.value.batch,
        hash: quizHash
      }
      const response = await this.saw.newTransaction(
        'NewQuiz',
        JSON.stringify( [ quizData, 'NewQuiz' ] ),
        [ this.user.privateKey, '0o11', quizData.batch, quizHash ] )
    }
  }
}
