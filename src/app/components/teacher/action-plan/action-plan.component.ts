import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TabStopPosition,
  TabStopType,
  TextRun,
  UnderlineType,
  WidthType,
} from 'docx';
import { saveAs } from 'file-saver';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf',
  },
};

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
    moA1: false,
    moA2: false,
    moA3: false,
    moA4: false,
    moA5: false,
    moA6: false,
    moA7: false,
    moA8: false,
    moA9: false,
    moA10: false,
    moA11: false,
    moA12: false,
    noteA: '',
  };
  public newAttribute3: any = {};
  public dataListPlan: any = null;
  public distance: string = 'P';
  public distance2: string = 'A';
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
  public dataBranchhead_action_plan: any = null;

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
    this.getBranchhead_action_plan();
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
    this.dataPlan_month = null;
    this.month = [];
    this.month2 = [];
    this.dataActionPlan_Completed = null;
  }
  public getYearactionPlan(e) {
    this.actionPlan_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.month_plan();
    this.getListPlan();
    this.getActionPlan_Completed();
    this.getActionPlan_Status();
    this.dataPlan_month = null;
    this.month = [];
    this.month2 = [];
    this.dataActionPlan_Completed = null;
  }
  // public getMonthactionPlan(e) {
  //   this.Plan_month = e;
  // }
  // public addPlan_month = async () => {
  //   let formData = new FormData();
  //   formData.append('month', this.Plan_month);
  //   formData.append('group', this.codeGroup);
  //   formData.append('year', this.actionPlan_year.value._year);

  //   let getData: any = await this.http.post('teacher/addMonth', formData);
  //   console.log(getData);
  //   if (getData.connect) {
  //     if (getData.response.rowCount > 0) {
  //       Swal.fire('เพิ่มเดือนเริ่มต้นสำเร็จ', '', 'success');
  //       this.month_plan();
  //     } else {
  //       Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
  //     }
  //   } else {
  //     Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
  //   }
  // };

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

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });

    let getData: any = await this.http.post(
      'teacher/addActionPlan_Action',
      formData
    );

    let getData2: any = await this.http.post(
      'teacher/addActionPlan_Action2',
      formData
    );

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

  // public getActionPlan_month = async () => {
  //   let formData = new FormData();
  //   formData.append('group', this.codeGroup);
  //   formData.append('year', this.actionPlan_year.value._year);
  //   let getData: any = await this.http.post(
  //     'teacher/getActionPlanMonth',
  //     formData
  //   );

  //   if (getData.connect) {
  //     if (getData.response.rowCount > 0) {
  //       this.dataActionPlan_month = getData.response.result;
  //     } else {
  //       this.dataActionPlan_month = null;
  //     }
  //   } else {
  //     alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
  //   }
  // };

  // public month_plan = async () => {
  //   let formData = new FormData();
  //   formData.append('year', this.actionPlan_year.value._year);

  //   let getData: any = await this.http.post('teacher/PlanMonth', formData);

  //   if (getData.connect) {
  //     if (getData.response.rowCount > 0) {
  //       this.dataPlan_month = getData.response.result[0].month;
  //       if (this.dataPlan_month != null) {
  //         var a = this.thmonth.indexOf(this.dataPlan_month);
  //         const b = this.thmonth;
  //         const c = this.thmonth;
  //         var d = this.actionPlan_year.value._year;
  //         var f = String(d.substring(2));
  //         var g = String(Number(d.substring(2)) + 1);

  //         for (var i = a; i < this.thmonth.length; i++) {
  //           this.month[i - a] = b[i] + f;
  //         }
  //         for (var i = 0; i < a; i++) {
  //           this.month2[i] = c[i] + g;
  //         }
  //       }
  //     } else {
  //       this.dataPlan_month = null;
  //       this.month = [];
  //       this.month2 = [];
  //     }
  //   } else {
  //     alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
  //   }
  // };
  // public delMonth = async () => {
  //   let formData = new FormData();
  //   formData.append('group', this.codeGroup);
  //   formData.append('year', this.actionPlan_year.value._year);

  //   this.http
  //     .confirmAlert('แน่ใจจะเปลี่ยนแปลงหรือไม่?')
  //     .then(async (value: any) => {
  //       if (value) {
  //         let getData: any = await this.http.post('teacher/delMonth', formData);

  //         if (getData.connect) {
  //           if (getData.response.rowCount > 0) {
  //             Swal.fire({
  //               position: 'top',
  //               icon: 'success',
  //               title: 'ลบข้อมูลสำเร็จ',
  //               showConfirmButton: false,
  //               timer: 1500,
  //             });
  //             this.month = [];
  //             this.month2 = [];
  //             this.month_plan();
  //           } else {
  //             Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
  //           }
  //         }
  //       }
  //     });
  // };
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
  public getBranchhead_action_plan = async () => {
    let formData = new FormData();
    formData.append(
      'branch',
      JSON.parse(localStorage.getItem('userLogin')).branch
    );
    let getData: any = await this.http.post(
      'teacher/getBranchhead_action_plan',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranchhead_action_plan = getData.response.result;
      } else {
        this.dataBranchhead_action_plan = null;
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
    this.dataPlan_month_Branchhead = null;
    this.month_Branchhead = [];
    this.month2_Branchhead = [];
  }
  public getYearactionPlan_Branchhead(e) {
    this.actionPlan_year_Branchhead = this.formBuilder.group({
      year: [e, Validators.required],
    });
    this.getActionPlan_Completed_Branchhead();
    this.month_plan_Branchhead();
    this.getActionPlan_Status_Branchhead();
    this.dataPlan_month_Branchhead = null;
    this.month_Branchhead = [];
    this.month2_Branchhead = [];
  }
  public async clickgroup_Branchhead(i) {
    this.group_Branchhead = i.study_group_id;
    this.getActionPlan_Completed_Branchhead();
    this.month_plan_Branchhead();
    this.getActionPlan_Status_Branchhead();
    this.dataPlan_month_Branchhead = null;
    this.month_Branchhead = [];
    this.month2_Branchhead = [];
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
    formData.append('year', this.actionPlan_year_Branchhead.value.year);

    let getData: any = await this.http.post('teacher/getMo', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        var date = getData.response.result[0].date_start.split('-', 2);
        this.dataPlan_month_Branchhead = Number(date[1]) - 1;

        if (this.dataPlan_month_Branchhead != null) {
          const b = this.thmonth;
          const c = this.thmonth;
          var d = this.actionPlan_year_Branchhead.value.year;
          var f = String(d.substring(2));
          var g = String(Number(d.substring(2)) + 1);

          for (
            let i = this.dataPlan_month_Branchhead;
            i < this.thmonth.length;
            i++
          ) {
            this.month_Branchhead[i - this.dataPlan_month_Branchhead] =
              b[i] + f;
          }
          for (let i = 0; i < this.dataPlan_month_Branchhead; i++) {
            this.month2_Branchhead[i] = c[i] + g;
          }
        }
      } else {
        this.dataPlan_month_Branchhead = null;
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
            } else {
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
  getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => {
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = url;
    });
  }
  public exportPDF = async () => {
    var month = this.month.concat(this.month2);

    let data_plan = [
      { width: '*', text: '' },
      {
        width: 'auto',
        table: {
          headerRows: 1,
          widths: [
            20,
            90,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            25,
          ],
          body: [
            [
              {
                text: 'ลำ\nดับ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: 'รายการ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },

              {
                text: 'ช่วงเวลา',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[0],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[1],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[2],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[3],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[4],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[5],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[6],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[7],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[8],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[9],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[10],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[11],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },

              {
                text: 'หมาย\nเหตุ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
            ],
          ],
          alignment: 'left',
        },
      },
      { width: '*', text: '' },
    ];
    var action = {
      m1: null,
      m2: null,
      m3: null,
      m4: null,
      m5: null,
      m6: null,
      m7: null,
      m8: null,
      m9: null,
      m10: null,
      m11: null,
      m12: null,
    };

    for (var i = 0; i < this.dataActionPlan_Completed.length; i++) {
      if (this.dataActionPlan_Completed[i].apa_m1 == 'true') {
        action.m1 = '/';
      } else {
        action.m1 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m2 == 'true') {
        action.m2 = '/';
      } else {
        action.m2 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m3 == 'true') {
        action.m3 = '/';
      } else {
        action.m3 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m4 == 'true') {
        action.m4 = '/';
      } else {
        action.m4 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m5 == 'true') {
        action.m5 = '/';
      } else {
        action.m5 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m6 == 'true') {
        action.m6 = '/';
      } else {
        action.m6 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m7 == 'true') {
        action.m7 = '/';
      } else {
        action.m7 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m8 == 'true') {
        action.m8 = '/';
      } else {
        action.m8 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m9 == 'true') {
        action.m9 = '/';
      } else {
        action.m9 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m10 == 'true') {
        action.m10 = '/';
      } else {
        action.m10 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m11 == 'true') {
        action.m11 = '/';
      } else {
        action.m11 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m12 == 'true') {
        action.m12 = '/';
      } else {
        action.m12 = '';
      }

      let data_plan2 = [
        {
          rowSpan: 2,
          text: String((i + 1) / 2 + 0.5),
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          rowSpan: 2,
          text: this.dataActionPlan_Completed[i].action_plan_list,
          style: '',
          alignment: '',
          bold: false,
        },
        {
          text: this.dataActionPlan_Completed[i].apa_distance,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m1,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m2,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m3,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m4,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m5,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m6,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m7,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m8,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m9,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m10,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m11,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m12,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: this.dataActionPlan_Completed[i].note,
          style: '',
          alignment: '',
          bold: false,
        },
      ];
      data_plan[1]['table']['body'].push(data_plan2);
    }

    const dd = {
      header: {},
      content: [
        {
          image: await this.getBase64ImageFromURL('assets/rmuti.png'),
          width: 30,
          height: 50,
        },
        {
          text: ' มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน  นครราชสีมา',
          fontSize: 12,
          margin: [35, 0, 0, 20],
          bold: true,
        },
        {
          text:
            'แผนปฏิบัติงานการบริการให้คำปรึกษาและแนะแนว ของอาจารย์ที่ปรึกษา' +
            ' ' +
            'ปีการศึกษา' +
            ' ' +
            this.actionPlan_year.value._year,
          fontSize: 16,
          alignment: 'center',
          bold: true,
        },
        {
          columns: data_plan,
          fontSize: 14,
        },
        {
          text:
            '\nลงชื่อ.................................................................\n( ' +
            JSON.parse(localStorage.getItem('userLogin')).titlename +
            JSON.parse(localStorage.getItem('userLogin')).fname +
            ' ' +
            JSON.parse(localStorage.getItem('userLogin')).lname +
            ' )',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'ผู้จัดทำแผนปฏิบัติงาน',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'วันที่................................................',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text:
            '\nลงชื่อ.................................................................\n( ' +
            this.dataBranchhead_action_plan[0].titlename +
            this.dataBranchhead_action_plan[0].fname +
            ' ' +
            this.dataBranchhead_action_plan[0].lname +
            ' )',

          fontSize: 16,
          alignment: 'right',
        },

        {
          text: 'หัวหน้าโปรแกรมวิชา/สาขาวิชา ผู้อนุมัติ',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'วันที่................................................',
          fontSize: 16,
          alignment: 'right',
        },
      ],

      defaultStyle: {
        font: 'THSarabunNew',
      },
    };

    pdfMake.createPdf(dd).open();
  };
  public createDOC() {
    var month = this.month.concat(this.month2);

    var dataG = null;

    var dataRow = [
      new TableRow({
        children: [
          new TableCell({
            // width: {
            //   size: 1,
            //   type: WidthType.PERCENTAGE,
            // },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: 'ลำ\nดับ',
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),

          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: 'รายการ',
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: 'ช่วงเวลา',
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[0],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[1],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[2],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[3],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[4],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[5],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[6],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[7],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[8],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[9],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[10],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: month[11],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: 'หมาย\nเหตุ',
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
        tableHeader: true,
      }),
    ];
    var action = {
      m1: null,
      m2: null,
      m3: null,
      m4: null,
      m5: null,
      m6: null,
      m7: null,
      m8: null,
      m9: null,
      m10: null,
      m11: null,
      m12: null,
    };
    for (var i = 0; i < this.dataActionPlan_Completed.length; i++) {
      if (this.dataActionPlan_Completed[i].apa_m1 == 'true') {
        action.m1 = '/';
      } else {
        action.m1 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m2 == 'true') {
        action.m2 = '/';
      } else {
        action.m2 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m3 == 'true') {
        action.m3 = '/';
      } else {
        action.m3 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m4 == 'true') {
        action.m4 = '/';
      } else {
        action.m4 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m5 == 'true') {
        action.m5 = '/';
      } else {
        action.m5 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m6 == 'true') {
        action.m6 = '/';
      } else {
        action.m6 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m7 == 'true') {
        action.m7 = '/';
      } else {
        action.m7 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m8 == 'true') {
        action.m8 = '/';
      } else {
        action.m8 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m9 == 'true') {
        action.m9 = '/';
      } else {
        action.m9 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m10 == 'true') {
        action.m10 = '/';
      } else {
        action.m10 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m11 == 'true') {
        action.m11 = '/';
      } else {
        action.m11 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m12 == 'true') {
        action.m12 = '/';
      } else {
        action.m12 = '';
      }
      var num = null;
      var data = null;
      if (i % 2 != 0) {
        num = i;
        if (num == 0.5) {
          num = null;
        }
        data = this.dataActionPlan_Completed[i].action_plan_list;
      }

      if (i % 2 == 0) {
        dataG = new TableRow({
          children: [
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: `${i / 2 + 1}`,
                      size: 32,
                    }),
                  ],

                  alignment: AlignmentType.CENTER,
                }),
              ],
              width: { size: 5, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              rowSpan: 2,
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataActionPlan_Completed[i].action_plan_list,
                      size: 32,
                    }),
                  ],
                }),
              ],
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataActionPlan_Completed[i].apa_distance,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m1,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m2,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m3,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m4,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m5,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m6,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m7,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m8,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m9,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m10,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m11,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m12,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataActionPlan_Completed[i].note,
                      size: 32,
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      } else {
        dataG = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataActionPlan_Completed[i].apa_distance,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m1,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m2,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m3,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m4,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m5,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m6,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m7,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m8,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m9,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m10,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m11,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: action.m12,
                      size: 32,
                    }),
                  ],
                  alignment: AlignmentType.CENTER,
                }),
              ],
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataActionPlan_Completed[i].note,
                      size: 32,
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
      }

      dataRow.push(dataG);
    }
    // const documentCreator = new DocumentCreator();
    const doc = new Document();
    doc.addSection({
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'แผนปฏิบัติงานการบริการให้คำปรึกษาและแนะแนว ของอาจารย์ที่ปรึกษา' +
                ' ' +
                'ปีการศึกษา' +
                ' ' +
                this.actionPlan_year.value._year,
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: dataRow,

          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: '',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: '',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'ลงชื่อ.................................................................',

              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                '( ' +
                JSON.parse(localStorage.getItem('userLogin')).titlename +
                JSON.parse(localStorage.getItem('userLogin')).fname +
                ' ' +
                JSON.parse(localStorage.getItem('userLogin')).lname +
                ' )',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ผู้จัดทำแผนปฏิบัติงาน',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'วันที่................................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({ font: 'TH SarabunPSK', text: '', size: 32 }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: '',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'ลงชื่อ.................................................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                '( ' +
                this.dataBranchhead_action_plan[0].titlename +
                this.dataBranchhead_action_plan[0].fname +
                ' ' +
                this.dataBranchhead_action_plan[0].lname +
                ' )',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'หัวหน้าโปรแกรมวิชา/สาขาวิชา ผู้อนุมัติ',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'วันที่................................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Plan_${this.nameGroup}.docx`);
    });
  }
  public month_plan = async () => {
    let formData = new FormData();
    formData.append('year', this.actionPlan_year.value._year);

    let getData: any = await this.http.post('teacher/getMo', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        var date = getData.response.result[0].date_start.split('-', 2);
        this.dataPlan_month = Number(date[1]) - 1;
        if (this.dataPlan_month != null) {
          const b = this.thmonth;
          const c = this.thmonth;
          var d = this.actionPlan_year.value._year;
          var f = String(d.substring(2));
          var g = String(Number(d.substring(2)) + 1);

          for (let i = this.dataPlan_month; i < this.thmonth.length; i++) {
            this.month[i - this.dataPlan_month] = b[i] + f;
          }
          for (let i = 0; i < this.dataPlan_month; i++) {
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
}
