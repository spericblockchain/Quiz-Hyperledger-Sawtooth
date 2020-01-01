import { AddQuizComponent } from './Components/professor/add-quiz/add-quiz.component'
import { AddStudentComponent } from './Components/university/add-student/add-student.component'
import { ResultComponent } from './Components/student/result/result.component'
import { StudentComponent } from './Components/student/student.component'
import { StudentRouteComponent } from './Components/student/student-route/student-route.component'
import { ProfessorRouteComponent } from './Components/professor/professor-route/professor-route.component'
import { UniversityRouteComponent } from './Components/university/university-route/university-route.component'
import { UniversityComponent } from './Components/university/university.component'
import { HomeComponent } from './Components/home/home.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { ProfessorComponent } from './Components/professor/professor.component'
import { LoginComponent } from './Components/login/login.component'
import { UniversityGuard } from './Guards/University/university.guard'
import { ProfessorGuard } from './Guards/Professor/professor.guard'
import { StudentGuard } from './Guards/Student/student.guard'

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'Login',
    component: LoginComponent
  },
  {
    path: 'University',
    component: UniversityRouteComponent,
    canActivate: [ UniversityGuard ],
    children: [
      {
        path: 'Students', component: AddStudentComponent
      },
      {
        path: '', component: UniversityComponent
      }
    ]
  },
  {
    path: 'Professor',
    component: ProfessorRouteComponent,
    canActivate: [ ProfessorGuard ],
    children: [
      {
        path: '', component: ProfessorComponent
      },
      {
        path: 'Add-Quiz', component: AddQuizComponent
      }
    ]
  },
  {
    path: 'Student',
    component: StudentRouteComponent,
    canActivate: [ StudentGuard ],
    children: [
      {
        path: '', component: StudentComponent
      },
      {
        path: 'Result', component: ResultComponent
      }
    ]
  },
]

@NgModule( {
  imports: [ RouterModule.forRoot( routes ) ],
  exports: [ RouterModule ]
} )
export class AppRoutingModule { }
