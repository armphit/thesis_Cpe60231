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
  public filesName: any = null;

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
  }
  public getYearAssessment(e) {
    this.assessment_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
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

        var getData: any = await this.http.post('teacher/getAssessment', Form);

        // Form.forEach((value, key) => {
        //   console.log(key + ':' + value);
        // });
      }
      console.log(getData);
      // else {
      //   for (let i = 0; i < this.data.length; i++) {
      //     //  let getData: any = await this.http.get('admin/uploadStudent/'+this.data[i]);
      //     //  console.log(getData)
      //     let Form = new FormData();
      //     Object.keys(this.data[i]).forEach((key) => {
      //       Form.append(key, this.data[i][key]);
      //     });
      //     Form.append('group', this.codeGroup);
      //     let getData: any = await this.http.post('admin/uploadStudent', Form);
      //   }
      // }
    }
  }
}
