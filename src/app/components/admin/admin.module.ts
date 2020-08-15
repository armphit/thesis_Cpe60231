import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { GroupComponent } from './manage-data/group/group.component';
import { StudentDataComponent } from './manage-data/student-data/student-data.component';
import { SharedModules } from 'src/app/shared-modules';
import { MatIconModule } from '@angular/material/icon';
import { AdviceDataComponent } from './advice-data/advice-data.component';
import { SemesterDataComponent } from './manage-data/semester-data/semester-data.component';
import { GoodnessRecordComponent } from './goodness-record/goodness-record.component';

@NgModule({
  declarations: [
    ManageDataComponent,
    GroupComponent,
    StudentDataComponent,
    AdviceDataComponent,
    SemesterDataComponent,
    GoodnessRecordComponent,
  ],
  imports: [CommonModule, AdminRoutingModule, SharedModules, MatIconModule],
})
export class AdminModule {}
