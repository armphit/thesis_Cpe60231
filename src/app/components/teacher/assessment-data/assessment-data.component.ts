import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-assessment-data',
  templateUrl: './assessment-data.component.html',
  styleUrls: ['./assessment-data.component.scss'],
})
export class AssessmentDataComponent implements OnInit {
  public dataGroup: any = null;
  public codeGroup: any = null;
  public nameGroup: any = null;
  public assessment_year: FormGroup;
  public range: Array<any> = [];
  public data: any = null;
  public filesName: any = 'โปรดเลือกไฟล์';
  public dataAssessment: any = null;

  public Episode1 = {
    count_men: null,
    count_women: null,
    level1: null,
    level2: null,
    frequency_over: null,
    frequency_less: null,
    frequency_never: null,
    service_career: null,
    service_study: null,
    service_bursary: null,
    service_personality: null,
    service_alumni: null,
    service_other: null,
  };

  public dataBranch_Faculty = {
    branch: null,
    faculty: null,
  };

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getCURDATE();
    this.getYear();
  }

  ngOnInit(): void {
    this.assessment_year = this.formBuilder.group({
      _year: [``, Validators.required],
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
  public clickGroup(codeGroup, group_name) {
    this.codeGroup = codeGroup;
    this.nameGroup = group_name;
    this.getAssessment();
    this.Episode1 = {
      count_men: 0,
      count_women: 0,
      level1: 0,
      level2: 0,
      frequency_over: 0,
      frequency_less: 0,
      frequency_never: 0,
      service_career: 0,
      service_study: 0,
      service_bursary: 0,
      service_personality: 0,
      service_alumni: 0,
      service_other: 0,
    };
    this.dataAssessment = null;
    this.filesName = 'โปรดเลือกไฟล์';
  }
  public getYearAssessment(e) {
    this.assessment_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.filesName = 'โปรดเลือกไฟล์';
    this.getAssessment();
    this.Episode1 = {
      count_men: 0,
      count_women: 0,
      level1: 0,
      level2: 0,
      frequency_over: 0,
      frequency_less: 0,
      frequency_never: 0,
      service_career: 0,
      service_study: 0,
      service_bursary: 0,
      service_personality: 0,
      service_alumni: 0,
      service_other: 0,
    };
    this.dataAssessment = null;
  }
  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
    this.data = null;
    this.filesName = null;
  };
  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        //this.dataCURDATE.term = getData.response.result[0].term ;
        this.assessment_year.patchValue({
          _year: getData.response.result[0].year,
        });
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public uploadFileAssessment(evt) {
    this.filesName = evt.target.files[0].name;
    const target: DataTransfer = <DataTransfer>evt.target;
    if (target.files.length !== 1) throw new Error('Cannot use');
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.data = XLSX.utils.sheet_to_json(ws, { header: 2 });
    };
    reader.readAsBinaryString(target.files[0]);
  }
  public async uploadAssessment() {
    if (this.data == null) {
      Swal.fire('โปรดเลือกไฟล์!', '', 'error');
    } else {
      for (let i = 0; i < this.data.length; i++) {
        let Form = new FormData();
        Object.keys(this.data[i]).forEach((key) => {
          Form.append(key, this.data[i][key]);
        });
        Form.append('group', this.codeGroup);
        Form.append('year', this.assessment_year.value._year);

        var getData: any = await this.http.post('teacher/addAssessment', Form);

        // Form.forEach((value, key) => {
        //   console.log(key + ':' + value);
        // });
      }

      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
          this.getAssessment();
          this.data = null;
          this.filesName = 'โปรดเลือกไฟล์';
        } else {
          Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  }
  public getAssessment = async () => {
    let a = this.nameGroup.split('.', 1);
    let b = this.nameGroup.replace(a + '.', '');
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.assessment_year.value._year);
    let getData: any = await this.http.post('teacher/getAssessment', formData);
    var men = 0;
    // var women = null;
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.getBranch_Faculty();
        this.dataAssessment = getData.response.result;
        for (var i = 0; i < getData.response.result.length; i++) {
          if (getData.response.result[i].sex == 'ชาย') {
            this.Episode1.count_men = this.Episode1.count_men + 1;
          } else if (getData.response.result[i].sex == 'หญิง') {
            this.Episode1.count_women = this.Episode1.count_women + 1;
          }

          if (b.substring(2, 3) == '1') {
            this.Episode1.level1 = this.Episode1.level1 + 1;
          } else if (b.substring(2, 3) == '2') {
            this.Episode1.level2 = this.Episode1.level2 + 1;
          }
          if (getData.response.result[i].frequency == 'ไม่เคยมารับบริการ') {
            this.Episode1.frequency_never = this.Episode1.frequency_never + 1;
          } else if (
            getData.response.result[i].frequency == 'น้อยกว่า  5  ครั้ง'
          ) {
            this.Episode1.frequency_less = this.Episode1.frequency_less + 1;
          } else if (
            getData.response.result[i].frequency == 'มากกว่า  5  ครั้ง'
          ) {
            this.Episode1.frequency_over = this.Episode1.frequency_over + 1;
          }
          if (getData.response.result[i].service == 'ข้อมูลเรื่องอาชีพ') {
            this.Episode1.service_career = this.Episode1.service_career + 1;
          } else if (
            getData.response.result[i].service == 'ข้อมูลเรื่องการศึกษา'
          ) {
            this.Episode1.service_study = this.Episode1.service_study + 1;
          } else if (getData.response.result[i].service == 'ทุนการศึกษา') {
            this.Episode1.service_bursary = this.Episode1.service_bursary + 1;
          } else if (
            getData.response.result[i].service ==
            'ข้อมูลบุคลิกภาพ  ธรรมะ  สุขภาพและการปรับตัว'
          ) {
            this.Episode1.service_personality =
              this.Episode1.service_personality + 1;
          } else if (getData.response.result[i].service == 'บริการศิษย์เก่า') {
            this.Episode1.service_alumni = this.Episode1.service_alumni + 1;
          } else if (getData.response.result[i].service == 'อื่นๆ') {
            this.Episode1.service_other = this.Episode1.service_other + 1;
          }
        }
        // this.Episode1.avg_men =
        //   (this.Episode1.count_men * 100) / getData.response.result.length;
        // this.Episode1.avg_men = this.Episode1.avg_men.toFixed(2);
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getValue(num) {
    return num.toFixed(2);
  }
  public getBranch_Faculty = async () => {
    let formData = new FormData();
    formData.append('ID', this.codeGroup);
    let getData: any = await this.http.post(
      'teacher/getBranch_Faculty',
      formData
    );
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranch_Faculty.branch = getData.response.result[0].NAME;
        this.dataBranch_Faculty.faculty = getData.response.result[0].n;
      } else {
        this.dataBranch_Faculty.branch = null;
        this.dataBranch_Faculty.faculty = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public delAssessment = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.assessment_year.value._year);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delAssessment',
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
            this.getAssessment();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };
}
