import { ApiService } from 'src/app/Services/api/api.service'
import { Injectable } from '@angular/core'
import { CryptoFactory, createContext } from 'sawtooth-sdk/signing'
import { Secp256k1PrivateKey } from 'sawtooth-sdk/signing/secp256k1'
import * as crypto from 'crypto-browserify'
import { TextEncoder } from 'text-encoding/lib/encoding'
import protobuf from 'sawtooth-sdk/protobuf'

export interface TransactionModel {
  FAMILY_NAME: any
  FAMILY_VERSION: any
  inputList: any
  outputList: any
  privateKey: any
  payload: any
}

@Injectable( {
  providedIn: 'root'
} )
export class SawtoothService {
  // REST_API_BASE_URL = 'http://sawtooth-rest-api:8008'
  // REST_API_BASE_URL = '/batches'
  context: any
  FAMILY_VERSION: string
  encoder: any
  constructor ( private api: ApiService ) {
    this.FAMILY_VERSION = '1.0'
    this.encoder = new TextEncoder( 'utf8' )
    this.context = createContext( 'secp256k1' )
  }
  genPrivatekey = () => this.context.newRandomPrivateKey().asHex();
  genPublickey = ( Key: string ) => {
    const key = Secp256k1PrivateKey.fromHex( Key )
    const signer = new CryptoFactory( this.context ).newSigner( key )
    return signer.getPublicKey().asHex()
  }
  hash = data => {
    return crypto
      .createHash( 'sha512' )
      .update( data )
      .digest( 'hex' )
  }
  genAddress = ( PublicKey: string, section: string, extra?: any[] ) => {
    const NAMESPACE = this.hash( 'QuizBlocks' )
    const sectionHash = this.hash( section )
    if ( extra && extra.length === 2 ) {
      const batchHash = this.hash( extra[ 0 ] )
      if ( extra[ 1 ] === null ) {
        return NAMESPACE.slice( 0, 6 ) + sectionHash.slice( 0, 6 ) + batchHash.slice( 0, 6 )
      }
      return NAMESPACE.slice( 0, 6 ) + sectionHash.slice( 0, 6 ) + batchHash.slice( 0, 6 ) + extra[ 1 ].slice( 0, 52 )
    }
    if ( PublicKey === null ) {
      return NAMESPACE.slice( 0, 6 ) + sectionHash.slice( 0, 6 )
    } else {
      const keyHash = this.hash( PublicKey )
      return NAMESPACE.slice( 0, 6 ) + sectionHash.slice( 0, 6 ) + keyHash.slice( 0, 58 )
    }
  }
  createTransaction = async ( newTransaction: TransactionModel ) => {
    const secp256k1pk = Secp256k1PrivateKey.fromHex( newTransaction.privateKey.trim() )
    const signer = new CryptoFactory( this.context ).newSigner( secp256k1pk )
    const payloadBytes = this.encoder.encode( newTransaction.payload )
    // create transaction header
    const transactionHeaderBytes = protobuf.TransactionHeader.encode( {
      familyName: newTransaction.FAMILY_NAME,
      familyVersion: newTransaction.FAMILY_VERSION,
      inputs: newTransaction.inputList,
      outputs: newTransaction.outputList,
      signerPublicKey: signer.getPublicKey().asHex(),
      nonce: '' + Math.random(),
      batcherPublicKey: signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: this.hash( payloadBytes ),
    } ).finish()
    // create transaction
    const transaction = protobuf.Transaction.create( {
      header: transactionHeaderBytes,
      headerSignature: signer.sign( transactionHeaderBytes ),
      payload: payloadBytes,
    } )
    // create batch header
    const batchHeaderBytes = protobuf.BatchHeader.encode( {
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: [ transaction ].map( txn => txn.headerSignature ),
    } ).finish()
    // create batch
    const batch = protobuf.Batch.create( {
      header: batchHeaderBytes,
      headerSignature: signer.sign( batchHeaderBytes ),
      transactions: [ transaction ],
    } )
    // create batchlist
    const batchListBytes = protobuf.BatchList.encode( {
      batches: [ batch ],
    } ).finish()
    // return await this.sendTransaction( batchListBytes, batchHeaderBytes )
    return await this.api.postBatchList( batchListBytes, protobuf.BatchHeader.decode( batchHeaderBytes ) )
  }
  newTransaction = async ( action: string, subject: string, visa: any[] ) => {
    console.log( 'Log: SawtoothService -> newTransaction -> action', action )
    try {
      switch ( action ) {
        case 'NewQuiz':
          console.log( 'ijneiwefewbf' )
          const professorPublicKey = this.genPublickey( visa[ 0 ] )
          const currentProfessorAddress = this.genAddress( professorPublicKey, '0o00' )
          const quizAddress = this.genAddress( professorPublicKey, visa[ 1 ], [ visa[ 2 ], visa[ 3 ] ] )
          return await this.createTransaction(
            {
              FAMILY_NAME: 'QUIZ_CHAIN_Professor',
              FAMILY_VERSION: this.FAMILY_VERSION,
              inputList: [ quizAddress, currentProfessorAddress ],
              outputList: [ quizAddress, currentProfessorAddress ],
              privateKey: visa[ 0 ],
              payload: subject
            }
          )
        case 'AddProfessor':
          const newprofessorAddress = this.genAddress( visa[ 1 ], visa[ 2 ] )
          return await this.createTransaction(
            {
              FAMILY_NAME: 'QUIZ_CHAIN_University',
              FAMILY_VERSION: this.FAMILY_VERSION,
              inputList: [ newprofessorAddress ],
              outputList: [ newprofessorAddress ],
              privateKey: visa[ 0 ],
              payload: subject
            }
          )
        case 'DeleteProfessor':
          return await this.createTransaction(
            {
              FAMILY_NAME: 'QUIZ_CHAIN_University',
              FAMILY_VERSION: this.FAMILY_VERSION,
              inputList: [ subject.trim() ],
              outputList: [ subject.trim() ],
              privateKey: visa[ 0 ],
              payload: JSON.stringify( [ subject.trim(), 'DeleteProfessor' ] )
            }
          )
        case 'AddStudent':
          const newstudentAddress = this.genAddress( visa[ 1 ], visa[ 2 ] )
          return await this.createTransaction(
            {
              FAMILY_NAME: 'QUIZ_CHAIN_University',
              FAMILY_VERSION: this.FAMILY_VERSION,
              inputList: [ newstudentAddress ],
              outputList: [ newstudentAddress ],
              privateKey: visa[ 0 ],
              payload: subject
            }
          )
        case 'DeleteStudent':
          return await this.createTransaction(
            {
              FAMILY_NAME: 'QUIZ_CHAIN_University',
              FAMILY_VERSION: this.FAMILY_VERSION,
              inputList: [ subject.trim() ],
              outputList: [ subject.trim() ],
              privateKey: visa[ 0 ],
              payload: JSON.stringify( [ subject.trim(), 'DeleteStudent' ] )
            }
          )
        default:
          break
      }
    } catch ( error ) {
      console.log( 'Log: SawtoothService -> newTransaction -> error', error )
    }
  }
}
