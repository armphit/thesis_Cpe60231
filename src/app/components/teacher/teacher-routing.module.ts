import { ActionPlanComponent } from './action-plan/action-plan.component';
import { GoodnessRecordComponent } from './goodness-record/goodness-record.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { TeacherComponent } from './teacher.component';
import { AdviceDataComponent } from './advice-data/advice-data.component';

const routes: Routes = [
  {
    path: '',
    component: TeacherComponent,
    children: [
      {
        path: 'manage-data',
        component: ManageDataComponent,
      },
      {
        path: 'advice-data',
        component: AdviceDataComponent,
      },
      {
        path: 'goodness-record',
        component: GoodnessRecordComponent,
      },
      {
        path: 'action-plan',
        component: ActionPlanComponent,
      },
      {
        path: '',
        redirectTo: '/teacher/manage-data',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/teacher',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
