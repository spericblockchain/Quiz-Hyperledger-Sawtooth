import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms'
import { UserModel } from 'src/app/Models/user.model'
import { StudentModel } from 'src/app/Models/student.model'
import { ApiService } from 'src/app/Services/api/api.service'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'

@Component( {
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: [ './add-student.component.scss' ]
} )
export class AddStudentComponent implements OnInit {
  BatchList = [
    'One', 'Two', 'Three', 'Four', 'Five'
  ]
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
  student: StudentModel[] = []
  constructor ( private api: ApiService, private saw: SawtoothService ) {
    this.user = JSON.parse( localStorage.getItem( 'data' ) )
  }

  ngOnInit() {
    this.onLoad()
  }
  onLoad = async () => {
    const studentState = this.saw.genAddress( null, '0o10' )
    const datas: [] = await this.api.getStateDataList( studentState )
    for ( const [ i, dta ] of datas.entries() ) {
      const data: any = dta
      const atobDta = JSON.parse( atob( data.data ) )
      this.student[ i ] = {
        address: data.address,
        mobile: atobDta.mobile,
        name: atobDta.name,
        subject: atobDta.subject,
        batch: atobDta.batch,
        publicKey: null
      }
    }
  }
  onSubmit = async ( form: NgForm ) => {
    const newStudent: StudentModel = form.value
    const response = await this.saw.newTransaction(
      'AddStudent',
      JSON.stringify( [ newStudent, 'AddStudent' ] ),
      [ this.user.privateKey, newStudent.publicKey, '0o10' ] )
    alert( 'Success' )
    await this.onLoad()
    form.resetForm()
  }
  removeStudent = async ( address ) => {
    const response = await this.saw.newTransaction(
      'DeleteStudent',
      address,
      [ this.user.privateKey ] )
    alert( 'student Removed From State' )
    await this.onLoad()
  }
}
