import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-goodness-record',
  templateUrl: './goodness-record.component.html',
  styleUrls: ['./goodness-record.component.scss'],
})
export class GoodnessRecordComponent implements OnInit {
  public dataGroup: any = null;
  public codeGroup: any = null;
  public advice_year: FormGroup;
  public range: Array<any> = [];
  public dataStudent: any = null;
  public formGoodness: FormGroup;
  private yearNow: any = null;
  public dataGoodness: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getCURDATE();
    this.getYear();
  }

  ngOnInit(): void {
    this.advice_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
    this.formGoodness = this.formBuilder.group({
      type: ['', Validators.required],
      detail: ['', Validators.required],
      awards: [''],
      note: [''],
      student: ['', Validators.required],
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
  public clickGroup(codeGroup) {
    this.codeGroup = codeGroup;
    // this.getAdvice();
    // this.getAdvice_notNull();
    this.getGoodnessStudent();
    this.getGoodness();
  }

  public getYearAdvice(e) {
    this.advice_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    // this.getCalendar();
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
        this.yearNow = getData.response.result[0].year;
        this.advice_year.patchValue({
          _year: getData.response.result[0].year,
        });
        // this.getAdvice();
        // this.getAdvice_notNull();
        // this.getStudent();
        // this.getCalendar();
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public clickAddGoddness() {
    this.formGoodness.reset();
  }
  // public typeGoodness(data) {
  //   console.log(data);
  // }

  public async getGoodnessStudent() {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post(
      'teacher/getGoodnessStudent',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataStudent = getData.response.result;
      } else {
        this.dataStudent = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }
  // public clickStudent(data) {
  //   console.log(data);
  // }
  public insertGoodness = async () => {
    let formData = new FormData();
    if (
      this.formGoodness.value.note == null &&
      this.formGoodness.value.awards == null
    ) {
      this.formGoodness.value.note = '';
      this.formGoodness.value.awards = '';
    } else if (this.formGoodness.value.note == null) {
      this.formGoodness.value.note = '';
    } else if (this.formGoodness.value.awards == null) {
      this.formGoodness.value.awards = '';
    }
    formData.append(
      'detail',
      this.formGoodness.value.type + ' ' + this.formGoodness.value.detail
    );
    formData.append('awards', this.formGoodness.value.awards);
    formData.append('note', this.formGoodness.value.note);
    formData.append('student', this.formGoodness.value.student);
    formData.append('year', this.yearNow);

    let getData: any = await this.http.post('teacher/addGoodness', formData);

    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        let win: any = window;
        win.$('#AddGoddness').modal('hide');
        this.getGoodness();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public async getGoodness() {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.advice_year.value._year);
    let getData: any = await this.http.post('teacher/getGoodness', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGoodness = getData.response.result;
      } else {
        this.dataGoodness = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }

  public clickUpdateGoodness(data) {
    this.getGoodnessStudent();
    let a = data.osb_detail.split(' ', 1);
    let b = data.osb_detail.replace(a + ' ', '');
    this.formGoodness = this.formBuilder.group({
      type: [a[0], Validators.required],
      detail: [b, Validators.required],
      awards: [data.osb_award],
      note: [data.osb_note],
      student: [data.osb_student, Validators.required],
      osb_id: [data.osb_id, Validators.required],
    });
  }

  public updateGoodness = async () => {
    let formData = new FormData();
    formData.append(
      'detail',
      this.formGoodness.value.type + ' ' + this.formGoodness.value.detail
    );
    formData.append('awards', this.formGoodness.value.awards);
    formData.append('note', this.formGoodness.value.note);
    formData.append('student', this.formGoodness.value.student);
    formData.append('year', this.yearNow);
    formData.append('ID', this.formGoodness.value.osb_id);

    let getData: any = await this.http.post('teacher/updateGoodness', formData);

    if (getData.connect) {
      if (getData.response.result) {
        this.getGoodness();
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        let win: any = window;
        win.$('#updateGoodness').modal('hide');
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public deleteGoodness = async (data: any) => {
    let formData = new FormData();
    formData.append('ID', data);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delGoodness',
          formData
        );
        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            this.getGoodness();
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };
}
