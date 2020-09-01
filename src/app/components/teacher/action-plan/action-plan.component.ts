import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-action-plan',
  templateUrl: './action-plan.component.html',
  styleUrls: ['./action-plan.component.scss'],
})
export class ActionPlanComponent implements OnInit {
  public dataGroup: any = null;
  public codeGroup: any = null;
  public nameGroup: any = null;
  public range: Array<any> = [];
  public month: Array<any> = [];
  public month2: Array<any> = [];
  public newAttribute: any = {
    moP1: false,
    moP2: false,
    moP3: false,
    moP4: false,
    moP5: false,
    moP6: false,
    moP7: false,
    moP8: false,
    moP9: false,
    moP10: false,
    moP11: false,
    moP12: false,
    noteP: '',
  };
  public newAttribute2: any = {
    moP1: false,
    moP2: false,
    moP3: false,
    moP4: false,
    moP5: false,
    moP6: false,
    moP7: false,
    moP8: false,
    moP9: false,
    moP10: false,
    moP11: false,
    moP12: false,
    noteP: '',
  };
  public newAttribute3: any = {};
  public dataListPlan: any = null;
  public distance: string = 'P';
  public distance2: string = 'A';
  public dataActionPlan_month: any = null;
  public Plan_month: any = null;
  public dataPlan_month: any = null;
  public dataActionPlan_Completed: any = null;
  public dataBranchhead: any = null;
  public dataBranch: any = null;
  public dataGroup_Branchhead: any = null;
  public dataActionPlan_Branchhead: any = null;
  public group_Branchhead: any = null;
  public dataPlan_month_Branchhead: any = null;
  public month_Branchhead: Array<any> = [];
  public month2_Branchhead: Array<any> = [];
  public dataActionPlan_Status: any = null;
  public dataActionPlan_Status_Branchhead: any = null;

  public actionPlan_year: FormGroup;
  public actionPlan_year_Branchhead: FormGroup;
  public actionPlan_list: FormGroup;
  public dataAction = { list: null, distance: null, id: null };
  public thmonth = new Array(
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.'
  );

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getCURDATE();
    this.getYear();
    this.getBranchhead();
    this.getBranch();
  }

  ngOnInit(): void {
    this.actionPlan_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
    this.actionPlan_year_Branchhead = this.formBuilder.group({
      year: [``, Validators.required],
    });
    this.actionPlan_list = this.formBuilder.group({
      name: [``, Validators.required],
    });
  }

  public getGroup = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('teacher/getGroup', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGroup = getData.response.result;
      } else {
        this.dataGroup = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public clickGroup(i) {
    this.codeGroup = i.study_group_id;
    this.nameGroup = i.study_group_name;

    this.month_plan();
    this.getListPlan();
    this.getActionPlan_Completed();
    this.getActionPlan_Status();
    // this.getAdvice_notNull();
  }
  public getYearactionPlan(e) {
    this.actionPlan_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.month_plan();
    this.getListPlan();
    this.getActionPlan_Status();
  }
  public getMonthactionPlan(e) {
    this.Plan_month = e;
  }
  public addPlan_month = async () => {
    let formData = new FormData();
    formData.append('month', this.Plan_month);
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);

    let getData: any = await this.http.post('teacher/addMonth', formData);
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มเดือนเริ่มต้นสำเร็จ', '', 'success');
        this.month_plan();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };
  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.actionPlan_year.patchValue({
          _year: getData.response.result[0].year,
        });
        this.actionPlan_year_Branchhead.patchValue({
          year: getData.response.result[0].year,
        });
      } else {
        alert('ไม่มีปีการศึกษา');
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public addListPlan = async () => {
    let formData = new FormData();
    formData.append('list', this.actionPlan_list.value.name);
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post('teacher/addActionPlan', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        this.getListPlan();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public getListPlan = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post('teacher/getActionPlan', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataListPlan = getData.response.result;
      } else {
        this.dataListPlan = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public addListPlan_Action = async (plan_id) => {
    let formData = new FormData();
    formData.append('list', plan_id);
    formData.append('distanceP', this.distance);
    formData.append('distanceA', this.distance2);
    for (var key in this.newAttribute) {
      formData.append(key, this.newAttribute[key]);
    }
    for (var key in this.newAttribute2) {
      formData.append(key, this.newAttribute2[key]);
    }

    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post(
      'teacher/addActionPlan_Action',
      formData
    );

    let getData2: any = await this.http.post(
      'teacher/addActionPlan_Action2',
      formData
    );
    console.log(getData2);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        this.getListPlan();
        this.getActionPlan_Completed();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
    this.actionPlan_list.reset();
    this.newAttribute = {
      moP1: false,
      moP2: false,
      moP3: false,
      moP4: false,
      moP5: false,
      moP6: false,
      moP7: false,
      moP8: false,
      moP9: false,
      moP10: false,
      moP11: false,
      moP12: false,
      noteP: '',
    };
  };

  public getActionPlan_month = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post(
      'teacher/getActionPlanMonth',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_month = getData.response.result;
      } else {
        this.dataActionPlan_month = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public month_plan = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);

    let getData: any = await this.http.post('teacher/PlanMonth', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataPlan_month = getData.response.result[0].month;
        if (this.dataPlan_month != null) {
          var a = this.thmonth.indexOf(this.dataPlan_month);
          const b = this.thmonth;
          const c = this.thmonth;
          var d = this.actionPlan_year.value._year;
          var f = String(d.substring(2));
          var g = String(Number(d.substring(2)) + 1);

          for (var i = a; i < this.thmonth.length; i++) {
            this.month[i - a] = b[i] + f;
          }
          for (var i = 0; i < a; i++) {
            this.month2[i] = c[i] + g;
          }
        }
      } else {
        this.dataPlan_month = null;
        this.month = [];
        this.month2 = [];
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public delMonth = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);

    this.http
      .confirmAlert('แน่ใจจะเปลี่ยนแปลงหรือไม่?')
      .then(async (value: any) => {
        if (value) {
          let getData: any = await this.http.post('teacher/delMonth', formData);

          if (getData.connect) {
            if (getData.response.rowCount > 0) {
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500,
              });
              this.month = [];
              this.month2 = [];
              this.month_plan();
            } else {
              Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
            }
          }
        }
      });
  };
  public delListPlan = async (data) => {
    let formData = new FormData();
    formData.append('ID', data);

    this.http
      .confirmAlert('ต้องการลบรายการหรือไม่?')
      .then(async (value: any) => {
        if (value) {
          let getData: any = await this.http.post(
            'teacher/delListPlan',
            formData
          );
          console.log(getData);
          if (getData.connect) {
            if (getData.response.rowCount > 0) {
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500,
              });
              this.actionPlan_list.reset();
              this.getListPlan();
              this.getActionPlan_Completed();
            } else {
              Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
            }
          }
        }
      });
  };
  public getActionPlan_Completed = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post(
      'teacher/getActionPlan_Completed',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_Completed = getData.response.result;
      } else {
        this.dataActionPlan_Completed = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getActionPlan_Status = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post(
      'teacher/getActionPlan_Status',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_Status = getData.response.result;
      } else {
        this.dataActionPlan_Status = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public getValue(data: any) {
    if (data == 'true') {
      data = '/';
    } else {
      data = '';
    }

    return data;
  }
  public clickEdit_List(list: any, id: any) {
    this.actionPlan_list = this.formBuilder.group({
      name: [list, Validators.required],
      id: [id, Validators.required],
    });
  }

  public clickUpdateList = async () => {
    let formData = new FormData();
    formData.append('list', this.actionPlan_list.value.name);
    formData.append('id', this.actionPlan_list.value.id);
    let getData: any = await this.http.post(
      'teacher/updateActionPlan_List',
      formData
    );
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        let win: any = window;
        win.$('#editList').modal('hide');
        Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
        this.getActionPlan_Completed();
      } else {
        Swal.fire('แก้ไขข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public clickEdit_Action(i) {
    this.dataAction.id = i.apa_id;
    this.dataAction.list = i.action_plan_list;
    this.dataAction.distance = i.apa_distance;
    this.newAttribute3 = {
      EDITEmoP1: JSON.parse(i.apa_m1),
      EDITEmoP2: JSON.parse(i.apa_m2),
      EDITEmoP3: JSON.parse(i.apa_m3),
      EDITEmoP4: JSON.parse(i.apa_m4),
      EDITEmoP5: JSON.parse(i.apa_m5),
      EDITEmoP6: JSON.parse(i.apa_m6),
      EDITEmoP7: JSON.parse(i.apa_m7),
      EDITEmoP8: JSON.parse(i.apa_m8),
      EDITEmoP9: JSON.parse(i.apa_m9),
      EDITEmoP10: JSON.parse(i.apa_m10),
      EDITEmoP11: JSON.parse(i.apa_m11),
      EDITEmoP12: JSON.parse(i.apa_m12),
      EDITEnoteP: i.note,
    };
  }
  public updateAction = async () => {
    let formData = new FormData();
    formData.append('id', this.dataAction.id);
    for (var key in this.newAttribute3) {
      formData.append(key, this.newAttribute3[key]);
    }
    let getData: any = await this.http.post(
      'teacher/updateActionPlan_Action',
      formData
    );
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        let win: any = window;
        win.$('#editAction').modal('hide');
        Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
        this.getActionPlan_Completed();
      } else {
        Swal.fire('แก้ไขข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public getBranchhead = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('teacher/getBranchhead', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranchhead = getData.response.result;
      } else {
        this.dataBranchhead = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getBranch = async () => {
    let formData = new FormData();
    formData.append(
      'code',
      JSON.parse(localStorage.getItem('userLogin')).branch
    );
    let getData: any = await this.http.post('admin/getBranch', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranch = getData.response.result;
      } else {
        this.dataBranch = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public async clickBranch_Branchhead(i) {
    let formData = new FormData();
    formData.append('codeBranch', i.code);
    let getData: any = await this.http.post('admin/getGroup', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGroup_Branchhead = getData.response.result;
      } else {
        this.dataGroup_Branchhead = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
    this.group_Branchhead = null;
    this.dataActionPlan_Branchhead = null;
  }
  public getYearactionPlan_Branchhead(e) {
    this.actionPlan_year_Branchhead = this.formBuilder.group({
      year: [e, Validators.required],
    });
    this.getActionPlan_Completed_Branchhead();
    this.month_plan_Branchhead();
    this.getActionPlan_Status_Branchhead();
  }
  public async clickgroup_Branchhead(i) {
    this.group_Branchhead = i.study_group_id;
    this.getActionPlan_Completed_Branchhead();
    this.month_plan_Branchhead();
    this.getActionPlan_Status_Branchhead();
  }
  public getActionPlan_Completed_Branchhead = async () => {
    let formData = new FormData();
    formData.append('group', this.group_Branchhead);
    formData.append('year', this.actionPlan_year_Branchhead.value.year);
    let getData: any = await this.http.post(
      'teacher/getActionPlan_Completed',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_Branchhead = getData.response.result;
      } else {
        this.dataActionPlan_Branchhead = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public month_plan_Branchhead = async () => {
    let formData = new FormData();
    formData.append('group', this.group_Branchhead);
    formData.append('year', this.actionPlan_year_Branchhead.value.year);

    let getData: any = await this.http.post('teacher/PlanMonth', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataPlan_month_Branchhead = getData.response.result[0].month;
        if (this.dataPlan_month_Branchhead != null) {
          var a = this.thmonth.indexOf(this.dataPlan_month_Branchhead);
          const b = this.thmonth;
          const c = this.thmonth;
          var d = this.actionPlan_year_Branchhead.value.year;
          var f = String(d.substring(2));
          var g = String(Number(d.substring(2)) + 1);

          for (var i = a; i < this.thmonth.length; i++) {
            this.month_Branchhead[i - a] = b[i] + f;
          }
          for (var i = 0; i < a; i++) {
            this.month2_Branchhead[i] = c[i] + g;
          }
        }
      } else {
        this.month_Branchhead = [];
        this.month2_Branchhead = [];
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public addActionPlan_Status = async () => {
    let formData = new FormData();
    formData.append('group', this.group_Branchhead);
    formData.append('year', this.actionPlan_year_Branchhead.value.year);
    formData.append('check', 'true');

    this.http
      .confirmAlert('อนุมัติแผนปฏิบัติงานหรือไม่?')
      .then(async (value: any) => {
        if (value) {
          let getData: any = await this.http.post(
            'teacher/addActionPlan_Status',
            formData
          );
          console.log(getData);
          if (getData.connect) {
            if (getData.response.rowCount > 0) {
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'อนุมัติแผนปฏิบัติงานสำเร็จ',
                showConfirmButton: false,
                timer: 1500,
              });
              this.getActionPlan_Status();
              this.getActionPlan_Status_Branchhead();
              Swal.fire('ไม่สามารถอนุมัติแผนปฏิบัติงาน!', '', 'error');
            }
          }
        }
      });
  };
  public getActionPlan_Status_Branchhead = async () => {
    let formData = new FormData();
    formData.append('group', this.group_Branchhead);
    formData.append('year', this.actionPlan_year_Branchhead.value.year);
    let getData: any = await this.http.post(
      'teacher/getActionPlan_Status',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_Status_Branchhead = getData.response.result;
      } else {
        this.dataActionPlan_Status_Branchhead = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
}
