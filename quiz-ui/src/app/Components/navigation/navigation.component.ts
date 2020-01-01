import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'

@Component( {
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: [ './navigation.component.scss' ]
} )
export class NavigationComponent implements OnInit {
  @Input()
  ContentType: number
  name: string
  constructor ( private route: Router ) {
    this.name = localStorage.getItem( 'name' )
  }

  ngOnInit() {
  }
  logOut() {
    localStorage.clear()
    this.route.navigateByUrl( '/' )
  }
}
