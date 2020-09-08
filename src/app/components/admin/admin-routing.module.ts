import { ActionPlanComponent } from './action-plan/action-plan.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { GroupComponent } from './manage-data/group/group.component';
import { StudentDataComponent } from './manage-data/student-data/student-data.component';
import { AdviceDataComponent } from './advice-data/advice-data.component';
import { SemesterDataComponent } from './manage-data/semester-data/semester-data.component';
import { GoodnessRecordComponent } from './goodness-record/goodness-record.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'manage-data',
        component: ManageDataComponent,
        children: [
          {
            path: 'group',
            component: GroupComponent,
          },
          {
            path: 'student-data',
            component: StudentDataComponent,
          },
          {
            path: 'semester-data',
            component: SemesterDataComponent,
          },
        ],
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
        redirectTo: '/admin/manage-data/group',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/admin/manage-data',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
