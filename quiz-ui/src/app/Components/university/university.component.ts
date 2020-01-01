import { ApiService } from 'src/app/Services/api/api.service'
import { async } from '@angular/core/testing'
import { UserModel } from './../../Models/user.model'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'
import { ProfessorModel } from './../../Models/professor.model'
import { Component, OnInit, DoCheck, OnDestroy } from '@angular/core'
import { NgForm } from '@angular/forms'

@Component( {
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: [ './university.component.scss' ]
} )
export class UniversityComponent implements OnInit, DoCheck {
  subjectList = [
    'Cloud Computing',
    'Compiler Design',
    'Computer architecture and organization',
    'Computer Networks', 'Data Base Management Systems',
    'Data Structures & Algorithms',
    'Design and Analysis of Algorithms',
    'Distributed Computing Systems'
  ]
  user: UserModel
  professor: ProfessorModel[] = []
  constructor ( private api: ApiService, private saw: SawtoothService ) {
    this.user = JSON.parse( localStorage.getItem( 'data' ) )
  }

  ngOnInit() {
    this.onLoad()
  }
  ngDoCheck() {
  }
  // ngOnDestroy() { this.onLoad() }
  onLoad = async () => {
    const ProfessorState = this.saw.genAddress( null, '0o00' )
    const datas: [] = await this.api.getStateDataList( ProfessorState )
    for ( const [ i, dta ] of datas.entries() ) {
      const data: any = dta
      const atobDta = JSON.parse( atob( data.data ) )
      this.professor[ i ] = {
        address: data.address,
        mobile: atobDta.mobile,
        name: atobDta.name,
        subject: atobDta.subject,
        publicKey: null
      }
    }
  }
  onSubmit = async ( form: NgForm ) => {
    const newProfessor: ProfessorModel = form.value
    const response = await this.saw.newTransaction(
      'AddProfessor',
      JSON.stringify( [ newProfessor, 'AddProfessor' ] ),
      [ this.user.privateKey, newProfessor.publicKey, '0o00' ]
    )
    alert( 'Success' )
    await this.onLoad()
    form.resetForm()
  }
  removeProfessor = async ( address ) => {
    const response = await this.saw.newTransaction( 'DeleteProfessor', address, [ this.user.privateKey ] )
    alert( 'Professor Removed From State' )
    await this.onLoad()
  }
}
