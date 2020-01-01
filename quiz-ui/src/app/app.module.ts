import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NavigationComponent } from './Components/navigation/navigation.component'
import { HomeComponent } from './Components/home/home.component'
import { UniversityRouteComponent } from './Components/university/university-route/university-route.component'
import { UniversityComponent } from './Components/university/university.component'
import { AddStudentComponent } from './Components/university/add-student/add-student.component'
import { AddQuizComponent } from './Components/professor/add-quiz/add-quiz.component'
import { ProfessorComponent } from './Components/professor/professor.component'
import { ProfessorRouteComponent } from './Components/professor/professor-route/professor-route.component'
import { StudentComponent } from './Components/student/student.component'
import { PlayQuizComponent } from './Components/student/play-quiz/play-quiz.component'
import { StudentRouteComponent } from './Components/student/student-route/student-route.component'
import { ResultComponent } from './Components/student/result/result.component'
import { LoginComponent } from './Components/login/login.component'
import { HttpClientModule } from '@angular/common/http'
import { MatRadioModule } from '@angular/material/radio'
import { MatFormFieldModule } from '@angular/material'
import { MatInputModule } from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
@NgModule( {
  declarations: [
    AppComponent,
    NavigationComponent,
    HomeComponent,
    UniversityRouteComponent,
    UniversityComponent,
    AddStudentComponent,
    AddQuizComponent,
    ProfessorComponent,
    ProfessorRouteComponent,
    StudentComponent,
    PlayQuizComponent,
    StudentRouteComponent,
    ResultComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule, MatRadioModule, MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
} )
export class AppModule { }
