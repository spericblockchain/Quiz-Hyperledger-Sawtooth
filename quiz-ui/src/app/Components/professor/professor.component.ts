import { Component, OnInit } from '@angular/core'
import { ApiService } from 'src/app/Services/api/api.service'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'
import { UserModel } from 'src/app/Models/user.model'
import { QuizDataModel, QuizModel } from 'src/app/Models/quiz.model'

@Component( {
  selector: 'app-professor',
  templateUrl: './professor.component.html',
  styleUrls: [ './professor.component.scss' ]
} )
export class ProfessorComponent implements OnInit {
  user: UserModel
  quizData: QuizDataModel[] = []
  quiz: QuizModel[] = []
  currentQuiz: any
  constructor ( private api: ApiService, private saw: SawtoothService ) {
    this.user = JSON.parse( localStorage.getItem( 'data' ) )
  }

  ngOnInit() {
    this.onLoad()
  }
  onLoad = async () => {
    const ProfessorState = this.user.stateAddress
    const datas: any[] = await this.api.getStateDataList( ProfessorState )
    const atobDta = JSON.parse( atob( datas[ 0 ].data ) )
    for ( const [ i, quizAddress ] of atobDta.quizList.entries() ) {
      this.quizData[ i ] = JSON.parse( JSON.parse( await this.api.getStateData( quizAddress ) ) )
    }
  }
  onChange = async ( event ) => {
    const selectQuiz: any = await this.api.getQuizById( event.target.value )
    this.currentQuiz = JSON.parse( selectQuiz )
  }
}
