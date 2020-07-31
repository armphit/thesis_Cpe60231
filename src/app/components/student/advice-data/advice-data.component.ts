import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss'],
})
export class AdviceDataComponent implements OnInit {
  public dataStudent: any = null;
  public thDate: any = null;
  public thTime: any = null;
  public inAdvice: FormGroup;
  public dataAdvice: any = null;
  public adviceID: any = null;
  public subjectEdit: any = null;
  public detailEdit: any = null;
  public dataAdviceNotNull: any = null;
  public thmonth = new Array(
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  );
  public advice_year: FormGroup;
  public range: Array<any> = [];
  public year_now: any = null;

  constructor(private http: HttpService, private formBuilder: FormBuilder) {
    this.getStudent();
    this.getYear();

    this.getCURDATE();
  }

  ngOnInit(): void {
    this.inAdvice = this.formBuilder.group({
      subject: ['', Validators.required],
      details: ['', Validators.required],
    });

    this.advice_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
  }
  public getStudent = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('student/getStudent', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataStudent = getData.response.result;
      } else {
        this.dataStudent = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public insertAdvice = async () => {
    let formData = new FormData();
    var now = new Date();
    var date =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append(
      'group',
      JSON.parse(localStorage.getItem('userLogin')).group
    );
    formData.append('subject', this.inAdvice.value.subject);
    formData.append('details', this.inAdvice.value.details);
    formData.append('dateNow', date);
    formData.append('year_study', this.year_now);

    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post('student/addAdvice', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addCounsel').modal('hide');
        this.getAdvice();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public clearFrom() {
    this.inAdvice.reset();
  }

  public getAdvice = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('year_study', this.advice_year.value._year);
    let getData: any = await this.http.post('student/getAdvice', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvice = getData.response.result;
      } else {
        this.dataAdvice = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public deleteAdvice = async (advice_id: any) => {
    let formData = new FormData();
    formData.append('code', advice_id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('student/delAdvice', formData);

        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getAdvice();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  public clickEdit = async (subject: any, detail: any, code: any) => {
    this.adviceID = code;
    this.subjectEdit = subject;
    this.detailEdit = detail;
    this.inAdvice = this.formBuilder.group({
      subject: [subject, Validators.required],
      details: [detail, Validators.required],
    });
  };

  public updateAdvice = async () => {
    let formData = new FormData();
    formData.append('subject', this.inAdvice.value.subject);
    formData.append('detail', this.inAdvice.value.details);
    formData.append('code', this.adviceID);

    if (
      this.inAdvice.value.subject == this.subjectEdit &&
      this.inAdvice.value.details == this.detailEdit
    ) {
      Swal.fire('แก้ไขข้อมูลอีกครั้ง!', '', 'error');
    } else {
      // formData.forEach((value, key) => {
      //   console.log(key + ':' + value);
      // });
      let getData: any = await this.http.post('student/editAdvice', formData);

      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          let win: any = window;
          win.$('#editAdvice').modal('hide');
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          this.getAdvice();
        } else {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  public getAdviceNotNull = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('year_study', this.advice_year.value._year);
    let getData: any = await this.http.post(
      'student/getAdviceNotNull',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdviceNotNull = getData.response.result;
      } else {
        this.dataAdviceNotNull = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public getDate(date: any) {
    var d = new Date(date);

    return (
      'วันที่' +
      '  ' +
      d.getDate() +
      '  ' +
      this.thmonth[d.getMonth()] +
      '  ' +
      (d.getFullYear() + 543)
    );
  }

  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };

  public getYearAdvice(e) {
    this.advice_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getAdvice();
    this.getAdviceNotNull();
    // this.getCalendar();
  }

  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.year_now = getData.response.result[0].year;
        this.advice_year.patchValue({
          _year: getData.response.result[0].year,
        });
        this.getAdvice();
        this.getAdviceNotNull();
        // this.getCalendar();
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
}
