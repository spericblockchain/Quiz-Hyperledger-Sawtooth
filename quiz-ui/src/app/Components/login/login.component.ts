import { Component, OnInit } from '@angular/core'
import { Location } from '@angular/common'
import { Router, } from '@angular/router'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'

@Component( {
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.scss' ]
} )
export class LoginComponent implements OnInit {
  state: any
  allState = [ 0, 1, 2 ]
  privateKey = ''
  newPrivateKey = ''
  newPublicKey = ''
  constructor ( private route: Router, private location: Location, private saw: SawtoothService ) {
  }

  ngOnInit() {
    this.state = this.location.getState()
    if ( this.allState.indexOf( this.state.user ) === -1 ) {
      this.route.navigateByUrl( '/' )
    }
  }

  login() {
    localStorage.setItem( 'key', this.privateKey )
    switch ( this.state.user ) {
      case 0:
        this.route.navigateByUrl( '/University' )
        break
      case 1:
        this.route.navigateByUrl( '/Professor' )
        break
      case 2:
        this.route.navigateByUrl( '/Student' )
        break
      default:
        console.log( 'This Shall Not come' )
        break
    }
  }
  GenerateKeys = () => {
    this.newPrivateKey = this.saw.genPrivatekey()
    this.newPublicKey = this.saw.genPublickey( this.newPrivateKey )
  }
  copyClip() {
    console.log( 'function add soon' )
  }
}
