import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { UserModel } from 'src/app/Models/user.model'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'
import { ApiService } from 'src/app/Services/api/api.service'

@Injectable( {
  providedIn: 'root'
} )
export class ProfessorGuard implements CanActivate {
  user: UserModel = {
    privateKey: '', stateAddress: ''
  }
  exp = new RegExp( '^[a-fA-F0-9]{64}$' )
  constructor ( private sawtooth: SawtoothService, private route: Router, private api: ApiService ) { }
  async canActivate(): Promise<boolean> {
    this.user.privateKey = localStorage.getItem( 'key' )
    if ( this.exp.test( this.user.privateKey ) ) {
      this.user.stateAddress = this.sawtooth.genAddress( this.sawtooth.genPublickey( this.user.privateKey ), '0o00' )
      const stateStatus = await this.api.getStateData( this.user.stateAddress )
      if ( !stateStatus.error ) {
        localStorage.clear()
        localStorage.setItem( 'name', JSON.parse( stateStatus ).name )
        localStorage.setItem( 'data', JSON.stringify( this.user ) )
        return true
      }
    }
    localStorage.clear()
    // alert( 'Invalid Private Key' )
    this.route.navigateByUrl( '/' )
  }
}
