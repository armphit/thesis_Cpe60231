import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { ManageDataComponent } from './manage-data/manage-data.component';
import { SharedModules } from 'src/app/shared-modules';
import { AdviceDataComponent } from './advice-data/advice-data.component';


@NgModule({
  declarations: [ManageDataComponent, AdviceDataComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    SharedModules
  ]
})
export class TeacherModule { }
