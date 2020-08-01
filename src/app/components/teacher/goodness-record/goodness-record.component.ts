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
        //this.dataCURDATE.term = getData.response.result[0].term ;
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
    console.log(this.formGoodness.value);
  };
}
