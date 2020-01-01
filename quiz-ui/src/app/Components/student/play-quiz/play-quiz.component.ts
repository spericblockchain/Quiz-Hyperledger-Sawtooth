import { async } from '@angular/core/testing'
import { SawtoothService } from './../../../Services/Sawtooth/sawtooth.service'
import { Component, OnInit } from '@angular/core'
import { StudentDataModel } from 'src/app/Models/student.model'
import { ApiService } from 'src/app/Services/api/api.service'
import { QuizDataModel, PlayQuizModel, PlayQuizList } from 'src/app/Models/quiz.model'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'

@Component( {
  selector: 'app-play-quiz',
  templateUrl: './play-quiz.component.html',
  styleUrls: [ './play-quiz.component.scss' ]
} )
export class PlayQuizComponent implements OnInit {
  studentData: StudentDataModel
  batchHash: string
  quizData: QuizDataModel[] = []
  quizlist: any
  currentQuiz: any = []
  SelectedQuiz: any = ''
  selection: string[] = []
  quizPlayForm: FormGroup
  constructor ( private route: Router, private saw: SawtoothService, private api: ApiService, public fb: FormBuilder ) {
    this.studentData = JSON.parse( localStorage.getItem( 'stateData' ) )
  }
  isSubmitted = false
  onSubmit() {
    this.isSubmitted = true
    if ( !this.quizPlayForm.valid ) {
      return false
    } else {
      alert( JSON.stringify( this.quizPlayForm.value ) )
    }
  }
  get myForm() {
    return this.quizPlayForm.get( 'answer' )
  }
  ngOnInit() {
    this.batchHash = this.saw.genAddress( null, '0o11', [ this.studentData.batch, null ] )
    this.onLoad()
    this.quizPlayForm = this.fb.group( {} )
    this.currentQuiz.forEach( qus => {
      this.quizPlayForm.addControl( qus.question, this.fb.control( null, Validators.required ) )
    } )
  }
  onLoad = async () => {
    const datas: [] = await this.api.getStateDataList( this.batchHash )
    const tempQuizData: QuizDataModel[] = []
    for ( const [ i, dta ] of datas.entries() ) {
      const data: any = dta
      const atobDta: any = JSON.parse( JSON.parse( atob( data.data ) ) )
      atobDta.address = data.address
      tempQuizData[ i ] = atobDta
    }
    this.quizData = tempQuizData.filter( q => {
      let isFound = false
      for ( const [ j, quiz ] of this.studentData.playedQuiz.entries() ) {
        if ( q.address === JSON.parse( quiz ).quiz ) {
          isFound = true
        }
      }
      if ( !isFound ) {
        return q
      }
    } )
  }
  onChange = async ( event ) => {
    this.SelectedQuiz = this.quizData.filter( dta => dta.id === event.target.value )
    this.currentQuiz = await this.api.getPlayQuizById( this.SelectedQuiz )
    this.selection = []
  }
  submitQuiz() {
    if ( this.currentQuiz[ 0 ].length !== this.selection.length ) {
      alert( 'Please Complete All Questions' )
      return
    } else {
      if ( confirm( `Are you sure you want to Submit Quiz? Ones Submited You Can't change` ) ) {
        const dta = JSON.parse( localStorage.getItem( 'data' ) )
        this.api.answerSubmit( this.selection, this.SelectedQuiz[ 0 ], dta.stateAddress )
        localStorage.clear()
        this.route.navigateByUrl( '/' )
      }
    }
  }
}
