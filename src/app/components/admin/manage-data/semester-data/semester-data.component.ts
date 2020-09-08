import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-semester-data',
  templateUrl: './semester-data.component.html',
  styleUrls: ['./semester-data.component.scss'],
})
export class SemesterDataComponent implements OnInit {
  public date_year: FormGroup;
  public range: Array<any> = [];
  public dataCalendar: any = null;
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
  public date_student: FormGroup;
  public year_study: Array<any> = [];

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getCURDATE();
    this.getYear();
  }

  ngOnInit(): void {
    this.date_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });

    this.date_student = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      selected_year: ['', Validators.required],
      selected_term: ['', Validators.required],
    });
  }

  public getYearStudy(e) {
    this.date_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getCalendar();
  }

  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };

  public clickCalendar = () => {
    this.date_student.reset();
    this.getYearCalendar();
  };

  public getCalendar = async () => {
    let formData = new FormData();
    formData.append('year', this.date_year.value._year);
    let getData: any = await this.http.post('teacher/getCalendar', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataCalendar = getData.response.result;
      } else {
        this.dataCalendar = null;
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

  public clickEditCalendar(data) {
    this.getYearCalendar();
    this.date_student = this.formBuilder.group({
      start: [data.date_start, Validators.required],
      end: [data.date_end, Validators.required],
      selected_year: [data.year, Validators.required],
      selected_term: [data.term, Validators.required],
      year: [data.year, Validators.required],
      term: [data.term, Validators.required],
    });
  }

  public deleteCalendar = async (year: any, term: any) => {
    let formData = new FormData();
    formData.append('year', year);
    formData.append('term', term);
    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delCalendar',
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
            this.getCalendar();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  public updateCalendar = async () => {
    const momentDate = new Date(this.date_student.value.start);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    const momentDate2 = new Date(this.date_student.value.end);
    const formattedDate2 = moment(momentDate2).format('YYYY-MM-DD');
    let formData = new FormData();
    formData.append('year', this.date_student.value.selected_year);
    formData.append('term', this.date_student.value.selected_term);
    formData.append('start', formattedDate);
    formData.append('end', formattedDate2);
    formData.append('yearEdit', this.date_student.value.year);
    formData.append('termEdit', this.date_student.value.term);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });

    if (formattedDate > formattedDate2) {
      Swal.fire(
        'ไม่สามารถเพิ่มปีการศึกษาได้',
        'วันเปิดเทอม - วันปิดเทอม ไม่ถูกต้อง',
        'error'
      );
    } else {
      let getData: any = await this.http.post(
        'teacher/updateCalendar',
        formData
      );

      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          let win: any = window;
          win.$('#editCalendar').modal('hide');
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          this.getCalendar();
        } else if (getData.response.error) {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', 'ภาคการศึกษาซ้ำ', 'error');
        } else {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };
  public getYearCalendar = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.year_study[i] = { value: `${year - i}` };
    }
  };

  public insertCalendar = async () => {
    const momentDate = new Date(this.date_student.value.start);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    const momentDate2 = new Date(this.date_student.value.end);
    const formattedDate2 = moment(momentDate2).format('YYYY-MM-DD');
    let formData = new FormData();
    formData.append('year', this.date_student.value.selected_year);
    formData.append('term', this.date_student.value.selected_term);
    formData.append('start', formattedDate);
    formData.append('end', formattedDate2);

    if (formattedDate > formattedDate2) {
      Swal.fire(
        'ไม่สามารถเพิ่มปีการศึกษาได้',
        'วันเปิดเทอม - วันปิดเทอม ไม่ถูกต้อง',
        'error'
      );
    } else {
      let getData: any = await this.http.post('teacher/addCalendar', formData);
      console.log(getData);
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('เพิ่มปีการศึกษาเสร็จสิ้น', '', 'success');
          let win: any = window;
          win.$('#addCalendar').modal('hide');
          this.getCalendar();
        } else if (getData.response.error) {
          Swal.fire(
            'ไม่สามารถเพิ่มปีการศึกษาได้',
            'ข้อมูลภาคการศึกษาซ้ำ',
            'error'
          );
        } else {
          Swal.fire('ไม่สามารถเพิ่มปีการศึกษาได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        //this.dataCURDATE.term = getData.response.result[0].term ;
        // this.formYearTerm = this.formBuilder.group({
        //   year: [getData.response.result[0].year, Validators.required],
        //   term: [getData.response.result[0].term, Validators.required],
        // });
        this.date_year.patchValue({
          _year: getData.response.result[0].year,
        });
        this.getCalendar();
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
}
