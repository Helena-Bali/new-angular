import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {CalcComponent} from "./calc/calc.component";
import {AuthGuard} from "./guards/auth.guard";

const routes: Routes = [
  {
    path: 'calc',
    canActivate: [AuthGuard],
    component: CalcComponent
  },
  {
    path: '',
    redirectTo: 'calc',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
