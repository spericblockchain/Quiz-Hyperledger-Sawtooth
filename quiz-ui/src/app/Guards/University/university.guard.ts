import { Injectable } from '@angular/core'
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { UserModel } from 'src/app/Models/user.model'
import { SawtoothService } from 'src/app/Services/Sawtooth/sawtooth.service'

@Injectable( {
  providedIn: 'root'
} )
export class UniversityGuard implements CanActivate {
  user: UserModel = {
    privateKey: '', stateAddress: ''
  }
  publicKey = '021f4c1e1e2b2fbe8dde7ecf4fe772d55777e85626ec563846467b34f6a6a02670'
  exp = new RegExp( '^[a-fA-F0-9]{64}$' )
  constructor ( private sawtooth: SawtoothService, private route: Router ) { }
  async canActivate(): Promise<boolean> {
    this.user.privateKey = localStorage.getItem( 'key' )
    if ( this.exp.test( this.user.privateKey ) ) {
      if ( this.publicKey === this.sawtooth.genPublickey( this.user.privateKey ) ) {
        this.user.stateAddress = this.sawtooth.genAddress( this.publicKey, '0o00' )
        localStorage.clear()
        localStorage.setItem( 'data', JSON.stringify( this.user ) )
        localStorage.setItem( 'name', 'University' )
        return true
      }
    }
    localStorage.clear()
    // alert( 'Invalid Private Key' )
    this.route.navigateByUrl( '/' )
  }
}
