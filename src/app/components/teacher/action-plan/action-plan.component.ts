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
    mo1: false,
    mo2: false,
    mo3: false,
    mo4: false,
    mo5: false,
    mo6: false,
    mo7: false,
    mo8: false,
    mo9: false,
    mo10: false,
    mo11: false,
    mo12: false,
  };
  public dataListPlan: any = null;
  public distance: string = 'P';
  public dataActionPlan_month: any = null;

  public actionPlan_year: FormGroup;
  public actionPlan_list: FormGroup;

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
  }

  ngOnInit(): void {
    this.actionPlan_year = this.formBuilder.group({
      _year: [``, Validators.required],
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
    this.getActionPlan_month();
    // this.getAdvice_notNull();
  }
  public getYearactionPlan(e) {
    this.actionPlan_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
  }
  public getMonthactionPlan(e) {
    var a = this.thmonth.indexOf(e);
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
    this.getListPlan();
    this.addActionPlan_month();
  }
  public reset() {
    this.month = [];
    this.month2 = [];
  }
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
    console.log(this.newAttribute);
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
    formData.append('distance', this.distance);
    for (var key in this.newAttribute) {
      formData.append(key, this.newAttribute[key]);
    }

    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post(
      'teacher/addActionPlan_Action',
      formData
    );
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public addActionPlan_month = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    var ary3 = this.month.concat(this.month2);

    // formData.append('month2', JSON.stringify(this.month2));
    for (var i = 0; i < ary3.length; i++) {
      formData.append('month[]', ary3[i]);
    }
    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post(
      'teacher/addActionPlan_month',
      formData
    );
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public getActionPlan_month = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post('teacher/getActionPlan', formData);
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
}
