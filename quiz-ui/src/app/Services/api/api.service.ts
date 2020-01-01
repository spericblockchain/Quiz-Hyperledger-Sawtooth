import { QuizModel } from './../../Models/quiz.model'
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable( {
  providedIn: 'root'
} )
export class ApiService {

  constructor ( private http: HttpClient ) { }
  getReceipt = async id => {
    try {
      const ReceiptResponse: any = await this.http.get( '/receipts?id=' + id ).toPromise()
      return ReceiptResponse
    } catch ( error ) {
    }
  }
  getStateData = async stateAddress => {
    // tslint:disable-next-line: no-shadowed-variable
    try {
      const StateResponse: any = await this.http.get( '/state/' + stateAddress ).toPromise()
      return atob( StateResponse.data )
    } catch ( error ) {
      return error
    }
  }
  getStateDataList = async stateAddress => {
    // tslint:disable-next-line: no-shadowed-variable
    try {
      const StateResponse: any = await this.http.get( '/state?address=' + stateAddress ).toPromise()
      return StateResponse.data
    } catch ( error ) {
      return error
    }
  }
  postBatchList = async ( batchListBytes, batchHeaderBytes ) => {
    const postBatchListURL = '/batches'
    const fetchOptions = {
      method: 'POST',
      body: batchListBytes,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    }
    const res = await window.fetch( postBatchListURL, fetchOptions )
    return [ res, batchHeaderBytes ]
  }

  sendQuizToDb = async ( dta: QuizModel[] ) => {
    return new Promise( async ( resolve, reject ) => {
      const quiz = { quiz: JSON.stringify( dta ) }
      this.http
        .post( '/db/admin/add', { quiz } )
        .subscribe( ( data ) => {
          resolve( data[ 1 ] === 1 ? data[ 0 ] : 0 )
        } )
    } )
  }
  getQuizById = async ( id: any ) => {
    return await this.http.get( `/db/admin/getByid/${id}` ).toPromise()
  }
  getPlayQuizById = async ( data: any ) => {
    return new Promise( async ( resolve, reject ) => {
      const quizHashList = { list: JSON.stringify( data ) }
      this.http.post( `/db/user/getByid`, { quizHashList } ).subscribe( data => {
        resolve( data )
      } )
    } )
  }
  answerSubmit = async ( answer, quiz, studentAddress ) => {
    return new Promise( async ( resolve, reject ) => {
      this.http.post( `/db/admin/calculate`, { answer, quiz, studentAddress } ).subscribe( data => {
        resolve( data )
      } )
    } )
  }
}
