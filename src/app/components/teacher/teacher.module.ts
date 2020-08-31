import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherRoutingModule } from './teacher-routing.module';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { SharedModules } from 'src/app/shared-modules';
import { AdviceDataComponent } from './advice-data/advice-data.component';
import { GoodnessRecordComponent } from './goodness-record/goodness-record.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActionPlanComponent } from './action-plan/action-plan.component';

@NgModule({
  declarations: [
    ManageDataComponent,
    AdviceDataComponent,
    GoodnessRecordComponent,
    ActionPlanComponent,
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModules,
    NgxPaginationModule,
  ],
})
export class TeacherModule {}
