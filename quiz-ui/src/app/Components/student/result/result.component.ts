import { async } from '@angular/core/testing'
import { Component, OnInit } from '@angular/core'
import { StudentDataModel } from 'src/app/Models/student.model'
import { ApiService } from 'src/app/Services/api/api.service'

@Component( {
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: [ './result.component.scss' ]
} )
export class ResultComponent implements OnInit {
  studentData: StudentDataModel
  playedQuiz: any[]
  playedQuizDta: any[] = []
  currentQuiz: any = []
  SelectedQuiz: any = ''
  constructor ( private api: ApiService ) {
    this.playedQuiz = JSON.parse( localStorage.getItem( 'stateData' ) ).playedQuiz
  }

  ngOnInit() {
    this.onLoad()
  }
  onLoad = async () => {
    for ( const [ i, dta ] of this.playedQuiz.entries() ) {
      this.playedQuizDta[ i ] = JSON.parse( dta )
      const QuizDta = JSON.parse( JSON.parse( await this.api.getStateData( this.playedQuizDta[ i ].quiz ) ) )
      this.playedQuizDta[ i ].name = QuizDta.name
    }
  }
  onChange = async ( event ) => {
    this.SelectedQuiz = this.playedQuizDta.filter( dta => dta.quiz === event.target.value )
  }
}
