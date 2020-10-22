import { HttpService } from './../../../services/http.service';
import { async } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
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

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
pdfMake.fonts = {
  THSarabunNew: {
    normal: 'THSarabunNew.ttf',
    bold: 'THSarabunNew Bold.ttf',
    italics: 'THSarabunNew Italic.ttf',
    bolditalics: 'THSarabunNew BoldItalic.ttf',
  },
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf',
  },
};

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
  public commentAssessment: Array<any> = [];
  public fileExcel: File;
  public filesName_Excel: any = 'โปรดเลือกไฟล์';
  public dataFileExcel: any = null;
  public nameTeacher: any = null;

  public Episode1 = {
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

  public Episode2 = {
    subtopic1_1: null,
    subtopic1_2: null,
    subtopic1_3: null,
    subtopic1_4: null,
    subtopic1_5: null,

    subtopic2_1: null,
    subtopic2_2: null,
    subtopic2_3: null,
    subtopic2_4: null,
    subtopic2_5: null,

    subtopic3_1: null,
    subtopic3_2: null,
    subtopic3_3: null,
    subtopic3_4: null,
    subtopic3_5: null,

    subtopic4_1: null,
    subtopic4_2: null,
    subtopic4_3: null,
    subtopic4_4: null,

    subtopic5_1: null,
    subtopic5_2: null,
    subtopic5_3: null,

    subtopic6_1: null,
    subtopic6_2: null,
    subtopic6_3: null,
  };
  public SD = {
    subtopic1_1: null,
    subtopic1_2: null,
    subtopic1_3: null,
    subtopic1_4: null,
    subtopic1_5: null,

    subtopic2_1: null,
    subtopic2_2: null,
    subtopic2_3: null,
    subtopic2_4: null,
    subtopic2_5: null,

    subtopic3_1: null,
    subtopic3_2: null,
    subtopic3_3: null,
    subtopic3_4: null,
    subtopic3_5: null,

    subtopic4_1: null,
    subtopic4_2: null,
    subtopic4_3: null,
    subtopic4_4: null,

    subtopic5_1: null,
    subtopic5_2: null,
    subtopic5_3: null,

    subtopic6_1: null,
    subtopic6_2: null,
    subtopic6_3: null,
  };
  public totalSD = {
    subtopic1_1: null,
    subtopic1_2: null,
    subtopic1_3: null,
    subtopic1_4: null,
    subtopic1_5: null,
    subtopic2_1: null,
    subtopic2_2: null,
    subtopic2_3: null,
    subtopic2_4: null,
    subtopic2_5: null,
    subtopic3_1: null,
    subtopic3_2: null,
    subtopic3_3: null,
    subtopic3_4: null,
    subtopic3_5: null,
    subtopic4_1: null,
    subtopic4_2: null,
    subtopic4_3: null,
    subtopic4_4: null,
    subtopic5_1: null,
    subtopic5_2: null,
    subtopic5_3: null,
    subtopic6_1: null,
    subtopic6_2: null,
    subtopic6_3: null,
    Total6: null,
    Total5: null,
    Total4: null,
    Total3: null,
    Total2: null,
    Total1: null,
  };
  public rating = {
    subtopic1_1: null,
    subtopic1_2: null,
    subtopic1_3: null,
    subtopic1_4: null,
    subtopic1_5: null,
    subtopic2_1: null,
    subtopic2_2: null,
    subtopic2_3: null,
    subtopic2_4: null,
    subtopic2_5: null,
    subtopic3_1: null,
    subtopic3_2: null,
    subtopic3_3: null,
    subtopic3_4: null,
    subtopic3_5: null,
    subtopic4_1: null,
    subtopic4_2: null,
    subtopic4_3: null,
    subtopic4_4: null,
    subtopic5_1: null,
    subtopic5_2: null,
    subtopic5_3: null,
    subtopic6_1: null,
    subtopic6_2: null,
    subtopic6_3: null,
    Total6: null,
    Total5: null,
    Total4: null,
    Total3: null,
    Total2: null,
    Total1: null,
  };

  public dataBranch_Faculty = {
    branch: null,
    faculty: null,
  };
  public dataBranchhead: any = null;
  public dataBranch: any = null;
  public dataGroup_Branchhead: any = null;
  public group_Branchhead: any = null;
  public group_name_Branchhead: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getCURDATE();
    this.getYear();
    this.getBranchhead();
    this.getBranch();
    this.getFileExcel();
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
    this.data = null;
    this.fileExcel = null;
    this.filesName_Excel = 'โปรดเลือกไฟล์';
    this.Episode2 = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,
      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,
      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,
      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,
      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,
      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
    };
    this.SD = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,

      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,

      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,

      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,

      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,

      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
    };
    this.totalSD = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,
      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,
      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,
      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,
      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,
      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
      Total6: null,
      Total5: null,
      Total4: null,
      Total3: null,
      Total2: null,
      Total1: null,
    };
    this.commentAssessment = [];
    this.group_Branchhead = null;
  }
  public getYearAssessment(e) {
    this.assessment_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.filesName = 'โปรดเลือกไฟล์';
    this.data = null;
    this.fileExcel = null;
    this.filesName_Excel = 'โปรดเลือกไฟล์';
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
    this.Episode2 = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,
      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,
      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,
      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,
      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,
      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
    };
    this.SD = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,

      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,

      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,

      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,

      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,

      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
    };
    this.totalSD = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,
      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,
      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,
      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,
      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,
      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
      Total6: null,
      Total5: null,
      Total4: null,
      Total3: null,
      Total2: null,
      Total1: null,
    };
    this.commentAssessment = [];
  }
  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
    this.filesName = 'โปรดเลือกไฟล์';
    this.data = null;
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

        var getData: any = await this.http.post_('teacher/addAssessment', Form);

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
    var a = null;
    var b = null;
    let formData = new FormData();
    var group = null;
    if (this.codeGroup != null) {
      group = this.codeGroup;
      a = this.nameGroup.split('.', 1);
      b = this.nameGroup.replace(a + '.', '');
    } else if (this.codeGroup == null) {
      group = this.group_Branchhead;
      a = this.group_name_Branchhead.split('.', 1);
      b = this.group_name_Branchhead.replace(a + '.', '');
    }
    formData.append('group', group);
    // formData.append('group', this.group_Branchhead);
    formData.append('year', this.assessment_year.value._year);
    let getData: any = await this.http.post('teacher/getAssessment', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.getBranch_Faculty();

        this.dataAssessment = getData.response.result;
        for (var i = 0; i < getData.response.result.length; i++) {
          if (getData.response.result[i].comment != '') {
            this.commentAssessment.push(getData.response.result[i].comment);
          }

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
          this.Episode2.subtopic1_1 =
            this.Episode2.subtopic1_1 +
            Number(getData.response.result[i].subtopic1_1);
          this.Episode2.subtopic1_2 =
            this.Episode2.subtopic1_2 +
            Number(getData.response.result[i].subtopic1_2);
          this.Episode2.subtopic1_3 =
            this.Episode2.subtopic1_3 +
            Number(getData.response.result[i].subtopic1_3);
          this.Episode2.subtopic1_4 =
            this.Episode2.subtopic1_4 +
            Number(getData.response.result[i].subtopic1_4);
          this.Episode2.subtopic1_5 =
            this.Episode2.subtopic1_5 +
            Number(getData.response.result[i].subtopic1_5);
          this.Episode2.subtopic2_1 =
            this.Episode2.subtopic2_1 +
            Number(getData.response.result[i].subtopic2_1);
          this.Episode2.subtopic2_2 =
            this.Episode2.subtopic2_2 +
            Number(getData.response.result[i].subtopic2_2);
          this.Episode2.subtopic2_3 =
            this.Episode2.subtopic2_3 +
            Number(getData.response.result[i].subtopic2_3);
          this.Episode2.subtopic2_4 =
            this.Episode2.subtopic2_4 +
            Number(getData.response.result[i].subtopic2_4);
          this.Episode2.subtopic2_5 =
            this.Episode2.subtopic2_5 +
            Number(getData.response.result[i].subtopic2_5);
          this.Episode2.subtopic3_1 =
            this.Episode2.subtopic3_1 +
            Number(getData.response.result[i].subtopic3_1);
          this.Episode2.subtopic3_2 =
            this.Episode2.subtopic3_2 +
            Number(getData.response.result[i].subtopic3_2);
          this.Episode2.subtopic3_3 =
            this.Episode2.subtopic3_3 +
            Number(getData.response.result[i].subtopic3_3);
          this.Episode2.subtopic3_4 =
            this.Episode2.subtopic3_4 +
            Number(getData.response.result[i].subtopic3_4);
          this.Episode2.subtopic3_5 =
            this.Episode2.subtopic3_5 +
            Number(getData.response.result[i].subtopic3_5);
          this.Episode2.subtopic4_1 =
            this.Episode2.subtopic4_1 +
            Number(getData.response.result[i].subtopic4_1);
          this.Episode2.subtopic4_2 =
            this.Episode2.subtopic4_2 +
            Number(getData.response.result[i].subtopic4_2);
          this.Episode2.subtopic4_3 =
            this.Episode2.subtopic4_3 +
            Number(getData.response.result[i].subtopic4_3);
          this.Episode2.subtopic4_4 =
            this.Episode2.subtopic4_4 +
            Number(getData.response.result[i].subtopic4_4);
          this.Episode2.subtopic5_1 =
            this.Episode2.subtopic5_1 +
            Number(getData.response.result[i].subtopic5_1);
          this.Episode2.subtopic5_2 =
            this.Episode2.subtopic5_2 +
            Number(getData.response.result[i].subtopic5_2);
          this.Episode2.subtopic5_3 =
            this.Episode2.subtopic5_3 +
            Number(getData.response.result[i].subtopic5_3);
          this.Episode2.subtopic6_1 =
            this.Episode2.subtopic6_1 +
            Number(getData.response.result[i].subtopic6_1);
          this.Episode2.subtopic6_2 =
            this.Episode2.subtopic6_2 +
            Number(getData.response.result[i].subtopic6_2);
          this.Episode2.subtopic6_3 =
            this.Episode2.subtopic6_3 +
            Number(getData.response.result[i].subtopic6_3);

          this.SD.subtopic1_1 =
            this.SD.subtopic1_1 +
            Number(getData.response.result[i].subtopic1_1) *
              Number(getData.response.result[i].subtopic1_1);
          this.SD.subtopic1_2 =
            this.SD.subtopic1_2 +
            Number(getData.response.result[i].subtopic1_2) *
              Number(getData.response.result[i].subtopic1_2);
          this.SD.subtopic1_3 =
            this.SD.subtopic1_3 +
            Number(getData.response.result[i].subtopic1_3) *
              Number(getData.response.result[i].subtopic1_3);
          this.SD.subtopic1_4 =
            this.SD.subtopic1_4 +
            Number(getData.response.result[i].subtopic1_4) *
              Number(getData.response.result[i].subtopic1_4);
          this.SD.subtopic1_5 =
            this.SD.subtopic1_5 +
            Number(getData.response.result[i].subtopic1_5) *
              Number(getData.response.result[i].subtopic1_5);
          this.SD.subtopic2_1 =
            this.SD.subtopic2_1 +
            Number(getData.response.result[i].subtopic2_1) *
              Number(getData.response.result[i].subtopic2_1);
          this.SD.subtopic2_2 =
            this.SD.subtopic2_2 +
            Number(getData.response.result[i].subtopic2_2) *
              Number(getData.response.result[i].subtopic2_2);
          this.SD.subtopic2_3 =
            this.SD.subtopic2_3 +
            Number(getData.response.result[i].subtopic2_3) *
              Number(getData.response.result[i].subtopic2_3);
          this.SD.subtopic2_4 =
            this.SD.subtopic2_4 +
            Number(getData.response.result[i].subtopic2_4) *
              Number(getData.response.result[i].subtopic2_4);
          this.SD.subtopic2_5 =
            this.SD.subtopic2_5 +
            Number(getData.response.result[i].subtopic2_5) *
              Number(getData.response.result[i].subtopic2_5);
          this.SD.subtopic3_1 =
            this.SD.subtopic3_1 +
            Number(getData.response.result[i].subtopic3_1) *
              Number(getData.response.result[i].subtopic3_1);
          this.SD.subtopic3_2 =
            this.SD.subtopic3_2 +
            Number(getData.response.result[i].subtopic3_2) *
              Number(getData.response.result[i].subtopic3_2);
          this.SD.subtopic3_3 =
            this.SD.subtopic3_3 +
            Number(getData.response.result[i].subtopic3_3) *
              Number(getData.response.result[i].subtopic3_3);
          this.SD.subtopic3_4 =
            this.SD.subtopic3_4 +
            Number(getData.response.result[i].subtopic3_4) *
              Number(getData.response.result[i].subtopic3_4);
          this.SD.subtopic3_5 =
            this.SD.subtopic3_5 +
            Number(getData.response.result[i].subtopic3_5) *
              Number(getData.response.result[i].subtopic3_5);
          this.SD.subtopic4_1 =
            this.SD.subtopic4_1 +
            Number(getData.response.result[i].subtopic4_1) *
              Number(getData.response.result[i].subtopic4_1);
          this.SD.subtopic4_2 =
            this.SD.subtopic4_2 +
            Number(getData.response.result[i].subtopic4_2) *
              Number(getData.response.result[i].subtopic4_2);
          this.SD.subtopic4_3 =
            this.SD.subtopic4_3 +
            Number(getData.response.result[i].subtopic4_3) *
              Number(getData.response.result[i].subtopic4_3);
          this.SD.subtopic4_4 =
            this.SD.subtopic4_4 +
            Number(getData.response.result[i].subtopic4_4) *
              Number(getData.response.result[i].subtopic4_4);
          this.SD.subtopic5_1 =
            this.SD.subtopic5_1 +
            Number(getData.response.result[i].subtopic5_1) *
              Number(getData.response.result[i].subtopic5_1);
          this.SD.subtopic5_2 =
            this.SD.subtopic5_2 +
            Number(getData.response.result[i].subtopic5_2) *
              Number(getData.response.result[i].subtopic5_2);
          this.SD.subtopic5_3 =
            this.SD.subtopic5_3 +
            Number(getData.response.result[i].subtopic5_3) *
              Number(getData.response.result[i].subtopic5_3);
          this.SD.subtopic6_1 =
            this.SD.subtopic6_1 +
            Number(getData.response.result[i].subtopic6_1) *
              Number(getData.response.result[i].subtopic6_1);
          this.SD.subtopic6_2 =
            this.SD.subtopic6_2 +
            Number(getData.response.result[i].subtopic6_2) *
              Number(getData.response.result[i].subtopic6_2);
          this.SD.subtopic6_3 =
            this.SD.subtopic6_3 +
            Number(getData.response.result[i].subtopic6_3) *
              Number(getData.response.result[i].subtopic6_3);
        }
        this.totalSD.subtopic1_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic1_1 -
            this.Episode2.subtopic1_1 * this.Episode2.subtopic1_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic1_2 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic1_2 -
            this.Episode2.subtopic1_2 * this.Episode2.subtopic1_2) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic1_3 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic1_3 -
            this.Episode2.subtopic1_3 * this.Episode2.subtopic1_3) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic1_4 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic1_4 -
            this.Episode2.subtopic1_4 * this.Episode2.subtopic1_4) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic1_5 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic1_5 -
            this.Episode2.subtopic1_5 * this.Episode2.subtopic1_5) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic2_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic2_1 -
            this.Episode2.subtopic2_1 * this.Episode2.subtopic2_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic2_2 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic2_2 -
            this.Episode2.subtopic2_2 * this.Episode2.subtopic2_2) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic2_3 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic2_3 -
            this.Episode2.subtopic2_3 * this.Episode2.subtopic2_3) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic2_4 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic2_4 -
            this.Episode2.subtopic2_4 * this.Episode2.subtopic2_4) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic2_5 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic2_5 -
            this.Episode2.subtopic2_5 * this.Episode2.subtopic2_5) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic3_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic3_1 -
            this.Episode2.subtopic3_1 * this.Episode2.subtopic3_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic3_2 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic3_2 -
            this.Episode2.subtopic3_2 * this.Episode2.subtopic3_2) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic3_3 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic3_3 -
            this.Episode2.subtopic3_3 * this.Episode2.subtopic3_3) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic3_4 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic3_4 -
            this.Episode2.subtopic3_4 * this.Episode2.subtopic3_4) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic3_5 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic3_5 -
            this.Episode2.subtopic3_5 * this.Episode2.subtopic3_5) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic4_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic4_1 -
            this.Episode2.subtopic4_1 * this.Episode2.subtopic4_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic4_2 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic4_2 -
            this.Episode2.subtopic4_2 * this.Episode2.subtopic4_2) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic4_3 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic4_3 -
            this.Episode2.subtopic4_3 * this.Episode2.subtopic4_3) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic4_4 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic4_4 -
            this.Episode2.subtopic4_4 * this.Episode2.subtopic4_4) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic5_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic5_1 -
            this.Episode2.subtopic5_1 * this.Episode2.subtopic5_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic5_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic5_1 -
            this.Episode2.subtopic5_1 * this.Episode2.subtopic5_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic5_2 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic5_2 -
            this.Episode2.subtopic5_2 * this.Episode2.subtopic5_2) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic5_3 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic5_3 -
            this.Episode2.subtopic5_3 * this.Episode2.subtopic5_3) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic6_1 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic6_1 -
            this.Episode2.subtopic6_1 * this.Episode2.subtopic6_1) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic6_2 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic6_2 -
            this.Episode2.subtopic6_2 * this.Episode2.subtopic6_2) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.subtopic6_3 = Math.sqrt(
          (this.dataAssessment.length * this.SD.subtopic6_3 -
            this.Episode2.subtopic6_3 * this.Episode2.subtopic6_3) /
            (this.dataAssessment.length * (this.dataAssessment.length - 1))
        );
        this.totalSD.Total1 = Math.sqrt(
          (5 *
            (Math.pow(this.totalSD.subtopic1_1, 2) +
              Math.pow(this.totalSD.subtopic1_2, 2) +
              Math.pow(this.totalSD.subtopic1_3, 2) +
              Math.pow(this.totalSD.subtopic1_4, 2) +
              Math.pow(this.totalSD.subtopic1_5, 2)) -
            Math.pow(
              this.totalSD.subtopic1_1 +
                this.totalSD.subtopic1_2 +
                this.totalSD.subtopic1_3 +
                this.totalSD.subtopic1_4 +
                this.totalSD.subtopic1_5,
              2
            )) /
            (5 * (5 - 1))
        );
        this.totalSD.Total2 = Math.sqrt(
          (5 *
            (Math.pow(this.totalSD.subtopic2_1, 2) +
              Math.pow(this.totalSD.subtopic2_2, 2) +
              Math.pow(this.totalSD.subtopic2_3, 2) +
              Math.pow(this.totalSD.subtopic2_4, 2) +
              Math.pow(this.totalSD.subtopic2_5, 2)) -
            Math.pow(
              this.totalSD.subtopic2_1 +
                this.totalSD.subtopic2_2 +
                this.totalSD.subtopic2_3 +
                this.totalSD.subtopic2_4 +
                this.totalSD.subtopic2_5,
              2
            )) /
            (5 * (5 - 1))
        );
        this.totalSD.Total3 = Math.sqrt(
          (5 *
            (Math.pow(this.totalSD.subtopic3_1, 2) +
              Math.pow(this.totalSD.subtopic3_2, 2) +
              Math.pow(this.totalSD.subtopic3_3, 2) +
              Math.pow(this.totalSD.subtopic3_4, 2) +
              Math.pow(this.totalSD.subtopic3_5, 2)) -
            Math.pow(
              this.totalSD.subtopic3_1 +
                this.totalSD.subtopic3_2 +
                this.totalSD.subtopic3_3 +
                this.totalSD.subtopic3_4 +
                this.totalSD.subtopic3_5,
              2
            )) /
            (5 * (5 - 1))
        );

        this.totalSD.Total4 = Math.sqrt(
          (4 *
            (Math.pow(this.totalSD.subtopic4_1, 2) +
              Math.pow(this.totalSD.subtopic4_2, 2) +
              Math.pow(this.totalSD.subtopic4_3, 2) +
              Math.pow(this.totalSD.subtopic4_4, 2)) -
            Math.pow(
              this.totalSD.subtopic4_1 +
                this.totalSD.subtopic4_2 +
                this.totalSD.subtopic4_3 +
                this.totalSD.subtopic4_4,
              2
            )) /
            (4 * (4 - 1))
        );
        this.totalSD.Total5 = Math.sqrt(
          (3 *
            (Math.pow(this.totalSD.subtopic5_1, 2) +
              Math.pow(this.totalSD.subtopic5_2, 2) +
              Math.pow(this.totalSD.subtopic5_3, 2)) -
            Math.pow(
              this.totalSD.subtopic5_1 +
                this.totalSD.subtopic5_2 +
                this.totalSD.subtopic5_3,
              2
            )) /
            (3 * (3 - 1))
        );
        this.totalSD.Total6 = Math.sqrt(
          (3 *
            (Math.pow(this.totalSD.subtopic6_1, 2) +
              Math.pow(this.totalSD.subtopic6_2, 2) +
              Math.pow(this.totalSD.subtopic6_3, 2)) -
            Math.pow(
              this.totalSD.subtopic6_1 +
                this.totalSD.subtopic6_2 +
                this.totalSD.subtopic6_3,
              2
            )) /
            (3 * (3 - 1))
        );

        if (this.Episode2.subtopic1_1 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic1_1 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic1_1 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic1_1 = 'ดี';
        } else if (
          this.Episode2.subtopic1_1 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic1_1 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic1_1 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic1_1 = 'พอใช้';
        } else if (this.Episode2.subtopic1_1 / this.dataAssessment.length > 0) {
          this.rating.subtopic1_1 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic1_2 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic1_2 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic1_2 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic1_2 = 'ดี';
        } else if (
          this.Episode2.subtopic1_2 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic1_2 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic1_2 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic1_2 = 'พอใช้';
        } else if (this.Episode2.subtopic1_2 / this.dataAssessment.length > 0) {
          this.rating.subtopic1_2 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic1_3 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic1_3 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic1_3 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic1_3 = 'ดี';
        } else if (
          this.Episode2.subtopic1_3 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic1_3 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic1_3 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic1_3 = 'พอใช้';
        } else if (this.Episode2.subtopic1_3 / this.dataAssessment.length > 0) {
          this.rating.subtopic1_3 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic1_4 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic1_4 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic1_4 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic1_4 = 'ดี';
        } else if (
          this.Episode2.subtopic1_4 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic1_4 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic1_4 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic1_4 = 'พอใช้';
        } else if (this.Episode2.subtopic1_4 / this.dataAssessment.length > 0) {
          this.rating.subtopic1_4 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic1_5 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic1_5 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic1_5 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic1_5 = 'ดี';
        } else if (
          this.Episode2.subtopic1_5 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic1_5 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic1_5 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic1_5 = 'พอใช้';
        } else if (this.Episode2.subtopic1_5 / this.dataAssessment.length > 0) {
          this.rating.subtopic1_5 = 'ควรปรับปรุง';
        }
        if (
          (this.Episode2.subtopic1_1 / this.dataAssessment.length +
            this.Episode2.subtopic1_2 / this.dataAssessment.length +
            this.Episode2.subtopic1_3 / this.dataAssessment.length +
            this.Episode2.subtopic1_4 / this.dataAssessment.length +
            this.Episode2.subtopic1_5 / this.dataAssessment.length) /
            5 >
          4.5
        ) {
          this.rating.Total1 = 'ดีมาก';
        } else if (
          (this.Episode2.subtopic1_1 / this.dataAssessment.length +
            this.Episode2.subtopic1_2 / this.dataAssessment.length +
            this.Episode2.subtopic1_3 / this.dataAssessment.length +
            this.Episode2.subtopic1_4 / this.dataAssessment.length +
            this.Episode2.subtopic1_5 / this.dataAssessment.length) /
            5 >
          3.5
        ) {
          this.rating.Total1 = 'ดี';
        } else if (
          (this.Episode2.subtopic1_1 / this.dataAssessment.length +
            this.Episode2.subtopic1_2 / this.dataAssessment.length +
            this.Episode2.subtopic1_3 / this.dataAssessment.length +
            this.Episode2.subtopic1_4 / this.dataAssessment.length +
            this.Episode2.subtopic1_5 / this.dataAssessment.length) /
            5 >
          2.5
        ) {
          this.rating.Total1 = 'ปานกลาง';
        } else if (
          (this.Episode2.subtopic1_1 / this.dataAssessment.length +
            this.Episode2.subtopic1_2 / this.dataAssessment.length +
            this.Episode2.subtopic1_3 / this.dataAssessment.length +
            this.Episode2.subtopic1_4 / this.dataAssessment.length +
            this.Episode2.subtopic1_5 / this.dataAssessment.length) /
            5 >
          1.5
        ) {
          this.rating.Total1 = 'พอใช้';
        } else if (
          (this.Episode2.subtopic1_1 / this.dataAssessment.length +
            this.Episode2.subtopic1_2 / this.dataAssessment.length +
            this.Episode2.subtopic1_3 / this.dataAssessment.length +
            this.Episode2.subtopic1_4 / this.dataAssessment.length +
            this.Episode2.subtopic1_5 / this.dataAssessment.length) /
            5 >
          0
        ) {
          this.rating.Total1 = 'ควรปรับปรุง';
        }

        if (this.Episode2.subtopic2_1 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic2_1 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic2_1 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic2_1 = 'ดี';
        } else if (
          this.Episode2.subtopic2_1 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic2_1 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic2_1 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic2_1 = 'พอใช้';
        } else if (this.Episode2.subtopic2_1 / this.dataAssessment.length > 0) {
          this.rating.subtopic2_1 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic2_2 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic2_2 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic2_2 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic2_2 = 'ดี';
        } else if (
          this.Episode2.subtopic2_2 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic2_2 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic2_2 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic2_2 = 'พอใช้';
        } else if (this.Episode2.subtopic2_2 / this.dataAssessment.length > 0) {
          this.rating.subtopic2_2 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic2_3 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic2_3 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic2_3 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic2_3 = 'ดี';
        } else if (
          this.Episode2.subtopic2_3 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic2_3 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic2_3 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic2_3 = 'พอใช้';
        } else if (this.Episode2.subtopic2_3 / this.dataAssessment.length > 0) {
          this.rating.subtopic2_3 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic2_4 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic2_4 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic2_4 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic2_4 = 'ดี';
        } else if (
          this.Episode2.subtopic2_4 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic2_4 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic2_4 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic2_4 = 'พอใช้';
        } else if (this.Episode2.subtopic2_4 / this.dataAssessment.length > 0) {
          this.rating.subtopic2_4 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic2_5 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic2_5 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic2_5 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic2_5 = 'ดี';
        } else if (
          this.Episode2.subtopic2_5 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic2_5 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic2_5 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic2_5 = 'พอใช้';
        } else if (this.Episode2.subtopic2_5 / this.dataAssessment.length > 0) {
          this.rating.subtopic2_5 = 'ควรปรับปรุง';
        }
        if (
          (this.Episode2.subtopic2_1 / this.dataAssessment.length +
            this.Episode2.subtopic2_2 / this.dataAssessment.length +
            this.Episode2.subtopic2_3 / this.dataAssessment.length +
            this.Episode2.subtopic2_4 / this.dataAssessment.length +
            this.Episode2.subtopic2_5 / this.dataAssessment.length) /
            5 >
          4.5
        ) {
          this.rating.Total2 = 'ดีมาก';
        } else if (
          (this.Episode2.subtopic2_1 / this.dataAssessment.length +
            this.Episode2.subtopic2_2 / this.dataAssessment.length +
            this.Episode2.subtopic2_3 / this.dataAssessment.length +
            this.Episode2.subtopic2_4 / this.dataAssessment.length +
            this.Episode2.subtopic2_5 / this.dataAssessment.length) /
            5 >
          3.5
        ) {
          this.rating.Total2 = 'ดี';
        } else if (
          (this.Episode2.subtopic2_1 / this.dataAssessment.length +
            this.Episode2.subtopic2_2 / this.dataAssessment.length +
            this.Episode2.subtopic2_3 / this.dataAssessment.length +
            this.Episode2.subtopic2_4 / this.dataAssessment.length +
            this.Episode2.subtopic2_5 / this.dataAssessment.length) /
            5 >
          2.5
        ) {
          this.rating.Total2 = 'ปานกลาง';
        } else if (
          (this.Episode2.subtopic2_1 / this.dataAssessment.length +
            this.Episode2.subtopic2_2 / this.dataAssessment.length +
            this.Episode2.subtopic2_3 / this.dataAssessment.length +
            this.Episode2.subtopic2_4 / this.dataAssessment.length +
            this.Episode2.subtopic2_5 / this.dataAssessment.length) /
            5 >
          1.5
        ) {
          this.rating.Total2 = 'พอใช้';
        } else if (
          (this.Episode2.subtopic2_1 / this.dataAssessment.length +
            this.Episode2.subtopic2_2 / this.dataAssessment.length +
            this.Episode2.subtopic2_3 / this.dataAssessment.length +
            this.Episode2.subtopic2_4 / this.dataAssessment.length +
            this.Episode2.subtopic2_5 / this.dataAssessment.length) /
            5 >
          0
        ) {
          this.rating.Total2 = 'ควรปรับปรุง';
        }

        if (this.Episode2.subtopic3_1 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic3_1 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic3_1 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic3_1 = 'ดี';
        } else if (
          this.Episode2.subtopic3_1 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic3_1 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic3_1 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic3_1 = 'พอใช้';
        } else if (this.Episode2.subtopic3_1 / this.dataAssessment.length > 0) {
          this.rating.subtopic3_1 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic3_2 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic3_2 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic3_2 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic3_2 = 'ดี';
        } else if (
          this.Episode2.subtopic3_2 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic3_2 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic3_2 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic3_2 = 'พอใช้';
        } else if (this.Episode2.subtopic3_2 / this.dataAssessment.length > 0) {
          this.rating.subtopic3_2 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic3_3 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic3_3 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic3_3 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic3_3 = 'ดี';
        } else if (
          this.Episode2.subtopic3_3 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic3_3 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic3_3 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic3_3 = 'พอใช้';
        } else if (this.Episode2.subtopic3_3 / this.dataAssessment.length > 0) {
          this.rating.subtopic3_3 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic3_4 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic3_4 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic3_4 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic3_4 = 'ดี';
        } else if (
          this.Episode2.subtopic3_4 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic3_4 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic3_4 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic3_4 = 'พอใช้';
        } else if (this.Episode2.subtopic3_4 / this.dataAssessment.length > 0) {
          this.rating.subtopic3_4 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic3_5 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic3_5 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic3_5 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic3_5 = 'ดี';
        } else if (
          this.Episode2.subtopic3_5 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic3_5 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic3_5 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic3_5 = 'พอใช้';
        } else if (this.Episode2.subtopic3_5 / this.dataAssessment.length > 0) {
          this.rating.subtopic3_5 = 'ควรปรับปรุง';
        }
        if (
          (this.Episode2.subtopic3_1 / this.dataAssessment.length +
            this.Episode2.subtopic3_2 / this.dataAssessment.length +
            this.Episode2.subtopic3_3 / this.dataAssessment.length +
            this.Episode2.subtopic3_4 / this.dataAssessment.length +
            this.Episode2.subtopic3_5 / this.dataAssessment.length) /
            5 >
          4.5
        ) {
          this.rating.Total3 = 'ดีมาก';
        } else if (
          (this.Episode2.subtopic3_1 / this.dataAssessment.length +
            this.Episode2.subtopic3_2 / this.dataAssessment.length +
            this.Episode2.subtopic3_3 / this.dataAssessment.length +
            this.Episode2.subtopic3_4 / this.dataAssessment.length +
            this.Episode2.subtopic3_5 / this.dataAssessment.length) /
            5 >
          3.5
        ) {
          this.rating.Total3 = 'ดี';
        } else if (
          (this.Episode2.subtopic3_1 / this.dataAssessment.length +
            this.Episode2.subtopic3_2 / this.dataAssessment.length +
            this.Episode2.subtopic3_3 / this.dataAssessment.length +
            this.Episode2.subtopic3_4 / this.dataAssessment.length +
            this.Episode2.subtopic3_5 / this.dataAssessment.length) /
            5 >
          2.5
        ) {
          this.rating.Total3 = 'ปานกลาง';
        } else if (
          (this.Episode2.subtopic3_1 / this.dataAssessment.length +
            this.Episode2.subtopic3_2 / this.dataAssessment.length +
            this.Episode2.subtopic3_3 / this.dataAssessment.length +
            this.Episode2.subtopic3_4 / this.dataAssessment.length +
            this.Episode2.subtopic3_5 / this.dataAssessment.length) /
            5 >
          1.5
        ) {
          this.rating.Total3 = 'พอใช้';
        } else if (
          (this.Episode2.subtopic3_1 / this.dataAssessment.length +
            this.Episode2.subtopic3_2 / this.dataAssessment.length +
            this.Episode2.subtopic3_3 / this.dataAssessment.length +
            this.Episode2.subtopic3_4 / this.dataAssessment.length +
            this.Episode2.subtopic3_5 / this.dataAssessment.length) /
            5 >
          0
        ) {
          this.rating.Total3 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic4_1 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic4_1 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic4_1 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic4_1 = 'ดี';
        } else if (
          this.Episode2.subtopic4_1 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic4_1 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic4_1 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic4_1 = 'พอใช้';
        } else if (this.Episode2.subtopic4_1 / this.dataAssessment.length > 0) {
          this.rating.subtopic4_1 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic4_2 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic4_2 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic4_2 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic4_2 = 'ดี';
        } else if (
          this.Episode2.subtopic4_2 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic4_2 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic4_2 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic4_2 = 'พอใช้';
        } else if (this.Episode2.subtopic4_2 / this.dataAssessment.length > 0) {
          this.rating.subtopic4_2 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic4_3 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic4_3 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic4_3 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic4_3 = 'ดี';
        } else if (
          this.Episode2.subtopic4_3 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic4_3 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic4_3 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic4_3 = 'พอใช้';
        } else if (this.Episode2.subtopic4_3 / this.dataAssessment.length > 0) {
          this.rating.subtopic4_3 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic4_4 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic4_4 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic4_4 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic4_4 = 'ดี';
        } else if (
          this.Episode2.subtopic4_4 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic4_4 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic4_4 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic4_4 = 'พอใช้';
        } else if (this.Episode2.subtopic4_4 / this.dataAssessment.length > 0) {
          this.rating.subtopic4_4 = 'ควรปรับปรุง';
        }

        if (
          (this.Episode2.subtopic4_1 / this.dataAssessment.length +
            this.Episode2.subtopic4_2 / this.dataAssessment.length +
            this.Episode2.subtopic4_3 / this.dataAssessment.length +
            this.Episode2.subtopic4_4 / this.dataAssessment.length) /
            4 >
          4.5
        ) {
          this.rating.Total4 = 'ดีมาก';
        } else if (
          (this.Episode2.subtopic4_1 / this.dataAssessment.length +
            this.Episode2.subtopic4_2 / this.dataAssessment.length +
            this.Episode2.subtopic4_3 / this.dataAssessment.length +
            this.Episode2.subtopic4_4 / this.dataAssessment.length) /
            4 >
          3.5
        ) {
          this.rating.Total4 = 'ดี';
        } else if (
          (this.Episode2.subtopic4_1 / this.dataAssessment.length +
            this.Episode2.subtopic4_2 / this.dataAssessment.length +
            this.Episode2.subtopic4_3 / this.dataAssessment.length +
            this.Episode2.subtopic4_4 / this.dataAssessment.length) /
            4 >
          2.5
        ) {
          this.rating.Total4 = 'ปานกลาง';
        } else if (
          (this.Episode2.subtopic4_1 / this.dataAssessment.length +
            this.Episode2.subtopic4_2 / this.dataAssessment.length +
            this.Episode2.subtopic4_3 / this.dataAssessment.length +
            this.Episode2.subtopic4_4 / this.dataAssessment.length) /
            4 >
          1.5
        ) {
          this.rating.Total4 = 'พอใช้';
        } else if (
          (this.Episode2.subtopic4_1 / this.dataAssessment.length +
            this.Episode2.subtopic4_2 / this.dataAssessment.length +
            this.Episode2.subtopic4_3 / this.dataAssessment.length +
            this.Episode2.subtopic4_4 / this.dataAssessment.length) /
            4 >
          0
        ) {
          this.rating.Total4 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic5_1 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic5_1 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic5_1 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic5_1 = 'ดี';
        } else if (
          this.Episode2.subtopic5_1 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic5_1 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic5_1 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic5_1 = 'พอใช้';
        } else if (this.Episode2.subtopic5_1 / this.dataAssessment.length > 0) {
          this.rating.subtopic5_1 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic5_2 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic5_2 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic5_2 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic5_2 = 'ดี';
        } else if (
          this.Episode2.subtopic5_2 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic5_2 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic5_2 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic5_2 = 'พอใช้';
        } else if (this.Episode2.subtopic5_2 / this.dataAssessment.length > 0) {
          this.rating.subtopic5_2 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic5_3 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic5_3 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic5_3 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic5_3 = 'ดี';
        } else if (
          this.Episode2.subtopic5_3 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic5_3 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic5_3 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic5_3 = 'พอใช้';
        } else if (this.Episode2.subtopic5_3 / this.dataAssessment.length > 0) {
          this.rating.subtopic5_3 = 'ควรปรับปรุง';
        }

        if (
          (this.Episode2.subtopic5_1 / this.dataAssessment.length +
            this.Episode2.subtopic5_2 / this.dataAssessment.length +
            this.Episode2.subtopic5_3 / this.dataAssessment.length) /
            3 >
          4.5
        ) {
          this.rating.Total5 = 'ดีมาก';
        } else if (
          (this.Episode2.subtopic5_1 / this.dataAssessment.length +
            this.Episode2.subtopic5_2 / this.dataAssessment.length +
            this.Episode2.subtopic5_3 / this.dataAssessment.length) /
            3 >
          3.5
        ) {
          this.rating.Total5 = 'ดี';
        } else if (
          (this.Episode2.subtopic5_1 / this.dataAssessment.length +
            this.Episode2.subtopic5_2 / this.dataAssessment.length +
            this.Episode2.subtopic5_3 / this.dataAssessment.length) /
            3 >
          2.5
        ) {
          this.rating.Total5 = 'ปานกลาง';
        } else if (
          (this.Episode2.subtopic5_1 / this.dataAssessment.length +
            this.Episode2.subtopic5_2 / this.dataAssessment.length +
            this.Episode2.subtopic5_3 / this.dataAssessment.length) /
            3 >
          1.5
        ) {
          this.rating.Total5 = 'พอใช้';
        } else if (
          (this.Episode2.subtopic5_1 / this.dataAssessment.length +
            this.Episode2.subtopic5_2 / this.dataAssessment.length +
            this.Episode2.subtopic5_3 / this.dataAssessment.length) /
            3 >
          0
        ) {
          this.rating.Total5 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic6_1 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic6_1 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic6_1 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic6_1 = 'ดี';
        } else if (
          this.Episode2.subtopic6_1 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic6_1 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic6_1 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic6_1 = 'พอใช้';
        } else if (this.Episode2.subtopic6_1 / this.dataAssessment.length > 0) {
          this.rating.subtopic6_1 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic6_2 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic6_2 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic6_2 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic6_2 = 'ดี';
        } else if (
          this.Episode2.subtopic6_2 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic6_2 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic6_2 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic6_2 = 'พอใช้';
        } else if (this.Episode2.subtopic6_2 / this.dataAssessment.length > 0) {
          this.rating.subtopic6_2 = 'ควรปรับปรุง';
        }
        if (this.Episode2.subtopic6_3 / this.dataAssessment.length > 4.5) {
          this.rating.subtopic6_3 = 'ดีมาก';
        } else if (
          this.Episode2.subtopic6_3 / this.dataAssessment.length >
          3.5
        ) {
          this.rating.subtopic6_3 = 'ดี';
        } else if (
          this.Episode2.subtopic6_3 / this.dataAssessment.length >
          2.5
        ) {
          this.rating.subtopic6_3 = 'ปานกลาง';
        } else if (
          this.Episode2.subtopic6_3 / this.dataAssessment.length >
          1.5
        ) {
          this.rating.subtopic6_3 = 'พอใช้';
        } else if (this.Episode2.subtopic6_3 / this.dataAssessment.length > 0) {
          this.rating.subtopic6_3 = 'ควรปรับปรุง';
        }

        if (
          (this.Episode2.subtopic6_1 / this.dataAssessment.length +
            this.Episode2.subtopic6_2 / this.dataAssessment.length +
            this.Episode2.subtopic6_3 / this.dataAssessment.length) /
            3 >
          4.5
        ) {
          this.rating.Total6 = 'ดีมาก';
        } else if (
          (this.Episode2.subtopic6_1 / this.dataAssessment.length +
            this.Episode2.subtopic6_2 / this.dataAssessment.length +
            this.Episode2.subtopic6_3 / this.dataAssessment.length) /
            3 >
          3.5
        ) {
          this.rating.Total6 = 'ดี';
        } else if (
          (this.Episode2.subtopic6_1 / this.dataAssessment.length +
            this.Episode2.subtopic6_2 / this.dataAssessment.length +
            this.Episode2.subtopic6_3 / this.dataAssessment.length) /
            3 >
          2.5
        ) {
          this.rating.Total6 = 'ปานกลาง';
        } else if (
          (this.Episode2.subtopic6_1 / this.dataAssessment.length +
            this.Episode2.subtopic6_2 / this.dataAssessment.length +
            this.Episode2.subtopic6_3 / this.dataAssessment.length) /
            3 >
          1.5
        ) {
          this.rating.Total6 = 'พอใช้';
        } else if (
          (this.Episode2.subtopic6_1 / this.dataAssessment.length +
            this.Episode2.subtopic6_2 / this.dataAssessment.length +
            this.Episode2.subtopic6_3 / this.dataAssessment.length) /
            3 >
          0
        ) {
          this.rating.Total6 = 'ควรปรับปรุง';
        }
      } else {
        // this.dataAssessment = null;
        // this.commentAssessment = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getValue(num) {
    return num.toFixed(2);
  }
  public getBranch_Faculty = async () => {
    var group = null;
    if (this.codeGroup != null) {
      group = this.codeGroup;
    } else if (this.codeGroup == null) {
      group = this.group_Branchhead;
    }

    let formData = new FormData();
    formData.append('ID', group);
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
            this.Episode2 = {
              subtopic1_1: null,
              subtopic1_2: null,
              subtopic1_3: null,
              subtopic1_4: null,
              subtopic1_5: null,
              subtopic2_1: null,
              subtopic2_2: null,
              subtopic2_3: null,
              subtopic2_4: null,
              subtopic2_5: null,
              subtopic3_1: null,
              subtopic3_2: null,
              subtopic3_3: null,
              subtopic3_4: null,
              subtopic3_5: null,
              subtopic4_1: null,
              subtopic4_2: null,
              subtopic4_3: null,
              subtopic4_4: null,
              subtopic5_1: null,
              subtopic5_2: null,
              subtopic5_3: null,
              subtopic6_1: null,
              subtopic6_2: null,
              subtopic6_3: null,
            };
            this.SD = {
              subtopic1_1: null,
              subtopic1_2: null,
              subtopic1_3: null,
              subtopic1_4: null,
              subtopic1_5: null,

              subtopic2_1: null,
              subtopic2_2: null,
              subtopic2_3: null,
              subtopic2_4: null,
              subtopic2_5: null,

              subtopic3_1: null,
              subtopic3_2: null,
              subtopic3_3: null,
              subtopic3_4: null,
              subtopic3_5: null,

              subtopic4_1: null,
              subtopic4_2: null,
              subtopic4_3: null,
              subtopic4_4: null,

              subtopic5_1: null,
              subtopic5_2: null,
              subtopic5_3: null,

              subtopic6_1: null,
              subtopic6_2: null,
              subtopic6_3: null,
            };
            this.totalSD = {
              subtopic1_1: null,
              subtopic1_2: null,
              subtopic1_3: null,
              subtopic1_4: null,
              subtopic1_5: null,
              subtopic2_1: null,
              subtopic2_2: null,
              subtopic2_3: null,
              subtopic2_4: null,
              subtopic2_5: null,
              subtopic3_1: null,
              subtopic3_2: null,
              subtopic3_3: null,
              subtopic3_4: null,
              subtopic3_5: null,
              subtopic4_1: null,
              subtopic4_2: null,
              subtopic4_3: null,
              subtopic4_4: null,
              subtopic5_1: null,
              subtopic5_2: null,
              subtopic5_3: null,
              subtopic6_1: null,
              subtopic6_2: null,
              subtopic6_3: null,
              Total6: null,
              Total5: null,
              Total4: null,
              Total3: null,
              Total2: null,
              Total1: null,
            };
            this.commentAssessment = [];
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
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
    // this.dataActionPlan_Branchhead = null;
  }
  // public getYearactionPlan_Branchhead(e) {
  //   this.actionPlan_year_Branchhead = this.formBuilder.group({
  //     year: [e, Validators.required],
  //   });

  // }
  public async clickgroup_Branchhead(i) {
    this.nameTeacher = i.titlename + i.fname + ' ' + i.lname;
    this.group_Branchhead = i.study_group_id;
    this.group_name_Branchhead = i.study_group_name;
    this.codeGroup = null;
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
    this.data = null;
    this.Episode2 = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,
      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,
      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,
      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,
      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,
      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
    };
    this.SD = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,

      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,

      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,

      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,

      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,

      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
    };
    this.totalSD = {
      subtopic1_1: null,
      subtopic1_2: null,
      subtopic1_3: null,
      subtopic1_4: null,
      subtopic1_5: null,
      subtopic2_1: null,
      subtopic2_2: null,
      subtopic2_3: null,
      subtopic2_4: null,
      subtopic2_5: null,
      subtopic3_1: null,
      subtopic3_2: null,
      subtopic3_3: null,
      subtopic3_4: null,
      subtopic3_5: null,
      subtopic4_1: null,
      subtopic4_2: null,
      subtopic4_3: null,
      subtopic4_4: null,
      subtopic5_1: null,
      subtopic5_2: null,
      subtopic5_3: null,
      subtopic6_1: null,
      subtopic6_2: null,
      subtopic6_3: null,
      Total6: null,
      Total5: null,
      Total4: null,
      Total3: null,
      Total2: null,
      Total1: null,
    };
    this.commentAssessment = [];
  }

  public uploadFileExcel(file) {
    if (file) {
      this.fileExcel = file;
      this.filesName_Excel = file.name;
    }
  }
  public insertFileExcel = async () => {
    let formData = new FormData();

    formData.append('upload', this.fileExcel);
    formData.append('file_name', this.filesName_Excel);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });
    if (this.fileExcel == null) {
      Swal.fire('โปรดเลือกไฟล์', '', 'error');
    } else {
      let getData: any = await this.http.post('teacher/addFileExcel', formData);
      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
          this.getFileExcel();
        } else {
          Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };
  public getFileExcel = async () => {
    let getData: any = await this.http.post('teacher/getFileExcel');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataFileExcel = getData.response.result[0].file_excel;
      } else {
        this.dataFileExcel = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
    this.fileExcel = null;
    this.filesName_Excel = 'โปรดเลือกไฟล์';
  };
  public deleteFileExcel = async () => {
    let formData = new FormData();
    formData.append('ID', this.dataFileExcel);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delFileExcel',
          formData
        );

        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            this.getFileExcel();
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
  public async makePdf() {
    let data_st = [
      { width: '*', text: '' },
      {
        width: 'auto',
        table: {
          headerRows: 1,
          widths: [50, 400],
          body: [
            [
              {
                text: 'ลำดับ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },

              {
                text: 'ความคิดเห็น',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
            ],
          ],
          alignment: 'center',
        },
      },
      { width: '*', text: '' },
    ];
    for (var i = 0; i < this.commentAssessment.length; i++) {
      let dataaaa2 = [
        {
          text: i + 1,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: this.commentAssessment[i],
          style: '',
          alignment: '',
          bold: false,
        },
      ];
      data_st[1]['table']['body'].push(dataaaa2);
    }
    const dd = {
      header: {},
      footer(currentPage, pageCount) {
        return {
          columns: [
            { text: '', fontSize: 15, alignment: 'center' },
            // {
            //   text:
            //     'หน้าที่ ' +
            //     currentPage.toString() +
            //     ' จาก ' +
            //     pageCount +
            //     ' หน้า',
            //   margin: [5, 5, 15, 5],
            //   alignment: 'right',
            // },
          ],
        };
      },
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
        { width: '*', text: '' },
        {
          text:
            'ผลประเมินความพึงพอใจในการให้บริการให้คำปรึกษาและแนะแนวของอาจารย์ที่ปรึกษา\nประจำปีการศึกษา ' +
            this.assessment_year.value._year +
            '\n',
          fontSize: 16,
          alignment: 'center',
          bold: true,
        },
        {
          width: 'auto',
          table: {
            headerRows: 1,
            widths: [320, 80, 80],
            body: [
              [
                {
                  text: 'ส่วนที่ 1 ข้อมูลส่วนตัว',
                  style: 'tableHeader',
                  bold: true,
                },
                {
                  text: 'จำนวน',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },

                {
                  text: 'ร้อยละ',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
              ],
              [
                {
                  text: '1. เพศ',
                  bold: true,
                },
                {
                  text: '',

                  alignment: 'right',
                },
                {
                  text: '',

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'เพศชาย',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.count_men,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.count_men * 100) / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'เพศหญิง',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.count_women,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.count_women * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.dataAssessment.length,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.dataAssessment.length * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '2. ระดับการศึกษา',
                  bold: true,
                },
                {
                  text: '',

                  alignment: 'right',
                },
                {
                  text: '',

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ปวส.',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.level1,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.level1 * 100) / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ปริญญาตรี',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.level2,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.level2 * 100) / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.dataAssessment.length,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.dataAssessment.length * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '3. ' +
                    this.dataBranch_Faculty.faculty +
                    ' ' +
                    this.dataBranch_Faculty.branch,
                  bold: true,
                  colSpan: 3,
                },
              ],
              [
                {
                  text: '4. ความถี่ในการใช้บริการ',
                  bold: true,
                },
                {
                  text: '',

                  alignment: 'right',
                },
                {
                  text: '',

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ไม่เคยมารับบริการ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.frequency_never,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.frequency_never * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'น้อยกว่า 5 ครั้ง',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.frequency_less,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.frequency_less * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'มากกว่า 5 ครั้ง',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.frequency_over,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.frequency_over * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.dataAssessment.length,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.dataAssessment.length * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '5. เข้ารับบริการเรื่อง',
                  bold: true,
                },
                {
                  text: '',

                  alignment: 'right',
                },
                {
                  text: '',

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ข้อมูลเรื่องอาชีพ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.service_career,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.service_career * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ข้อมูลเรื่องการศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.service_study,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.service_study * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ทุนการศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.service_bursary,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.service_bursary * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'ข้อมูลบุคลิกภาพ ธรรมะ สุขภาพและการปรับตัว',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.service_personality,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.service_personality * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'บริการศิษย์เก่า',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.service_alumni,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.service_alumni * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'อื่นๆ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.Episode1.service_other,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.Episode1.service_other * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.dataAssessment.length,

                  alignment: 'right',
                },
                {
                  text: this.getValue(
                    (this.dataAssessment.length * 100) /
                      this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
              ],
            ],

            alignment: 'center',
          },
        },
        { text: '', pageBreak: 'before' },
        {
          text: '',
          width: 30,
          height: 50,
        },
        {
          text: ' ',
          fontSize: 12,
          margin: [35, 0, 0, 20],
          bold: true,
        },
        { width: '*', text: '' },
        {
          table: {
            headerRows: 2,
            widths: [300, '*', '*', '*', '*'],
            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  rowSpan: 2,
                  text: 'หัวข้อประเมิน',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
                {
                  colSpan: 3,
                  text: 'ระดับความพึงพอใจ (ร้อยละ)',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
                {},
                {},
              ],
              [
                {},
                {
                  text: 'x',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: 'S.D.',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: 'ระดับความพึงพอใจ',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
              ],
              [
                {
                  text: '1. คุณลักษณะด้านความสามารถเชิงวิชาการ',
                  bold: true,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: '1.1 รู้บทบาทหน้าที่ของอาจารย์ที่ปรึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic1_1 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic1_1),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic1_1,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '1.2 มีเทคนิคให้คำปรึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic1_2 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic1_2),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic1_2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '1.3 มีความสามารถให้คำแนะนำ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic1_3 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic1_3),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic1_3,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '1.4 มีความรู้เกี่ยวกับกฎระเบียบของมหาวิทยาลัย',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic1_4 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic1_4),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic1_4,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '1.5 มีความรู้ความสนใจเกี่ยวกับเหตุการณ์ปัจจุบัน',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic1_5 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic1_5),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic1_5,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.getValue(
                    (this.Episode2.subtopic1_1 / this.dataAssessment.length +
                      this.Episode2.subtopic1_2 / this.dataAssessment.length +
                      this.Episode2.subtopic1_3 / this.dataAssessment.length +
                      this.Episode2.subtopic1_4 / this.dataAssessment.length +
                      this.Episode2.subtopic1_5 / this.dataAssessment.length) /
                      5
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.Total1),

                  alignment: 'right',
                },
                {
                  text: this.rating.Total1,

                  alignment: 'right',
                },
              ],

              [
                {
                  text: '2. คุณลักษณะด้านบุคลิกภาพ',
                  bold: true,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text:
                    '2.1 มีความประพฤติแบบอย่างที่ดี มีความกระตือรือร้นสนใจในหน้าที่',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic2_1 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic2_1),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic2_1,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '2.2 รับฟังความคิดเห็นของนักศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic2_2 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic2_2),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic2_2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '2.3 มีบุคลิกภาพที่อบอุ่นและสุภาพเรียบร้อย สุขุมรอบคอบคุมอารมณ์',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic2_3 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic2_3),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic2_3,

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '2.4 เอาใจใส่นักศึกษาอย่างทั่วถึงกันและสม่ำเสมอเท่าเทียมกัน',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic2_4 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic2_4),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic2_4,

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '2.5 มีความพร้อมในการช่วยเหลือให้นักศึกษาเผชิญกับปัญหาต่างๆ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic2_5 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic2_5),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic2_5,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.getValue(
                    (this.Episode2.subtopic2_1 / this.dataAssessment.length +
                      this.Episode2.subtopic2_2 / this.dataAssessment.length +
                      this.Episode2.subtopic2_3 / this.dataAssessment.length +
                      this.Episode2.subtopic2_4 / this.dataAssessment.length +
                      this.Episode2.subtopic2_5 / this.dataAssessment.length) /
                      5
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.Total2),

                  alignment: 'right',
                },
                {
                  text: this.rating.Total2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '3. คุณลักษณะด้านเจตคติ',
                  bold: true,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text:
                    '3.1 มีความเต็มใจและยินดีในการทำหน้าที่อาจารย์ที่ปรึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic3_1 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic3_1),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic3_1,

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '3.2 มีความมุ่งมั่นต่อคุณภาพงานการให้คำปรึกษาด้านวิชาการ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic3_2 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic3_2),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic3_2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '3.3 การเป็นคนมองโลกในแง่ดี',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic3_3 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic3_3),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic3_3,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '3.4 การให้ความสำคัญกับนักศึกษาทุกคนเท่าเทียมกัน',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic3_4 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic3_4),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic3_4,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '3.5 มีความยุติธรรมแก่นักศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic3_5 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic3_5),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic3_5,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.getValue(
                    (this.Episode2.subtopic3_1 / this.dataAssessment.length +
                      this.Episode2.subtopic3_2 / this.dataAssessment.length +
                      this.Episode2.subtopic3_3 / this.dataAssessment.length +
                      this.Episode2.subtopic3_4 / this.dataAssessment.length +
                      this.Episode2.subtopic3_5 / this.dataAssessment.length) /
                      5
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.Total3),

                  alignment: 'right',
                },
                {
                  text: this.rating.Total3,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '4. คุณลักษณะด้านจรรยาบรรณ',
                  bold: true,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: '4.1 รักษาความลับ ข้อมูลส่วนตัวของนักศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic4_1 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic4_1),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic4_1,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '4.2 คำนึงถึงสวัสดิภาพของนักศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic4_2 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic4_2),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic4_2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '4.3 การให้กำลังใจแก่นักศึกษาที่เข้ามาขอรับคำปรึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic4_3 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic4_3),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic4_3,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '4.4 มีความเมตตา และกรุณากับนักศึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic4_4 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic4_4),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic4_4,

                  alignment: 'right',
                },
              ],

              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.getValue(
                    (this.Episode2.subtopic4_1 / this.dataAssessment.length +
                      this.Episode2.subtopic4_2 / this.dataAssessment.length +
                      this.Episode2.subtopic4_3 / this.dataAssessment.length +
                      this.Episode2.subtopic4_4 / this.dataAssessment.length) /
                      4
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.Total4),

                  alignment: 'right',
                },
                {
                  text: this.rating.Total4,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '5. คุณลักษณะด้านทักษะการปฏิบัติงาน',
                  bold: true,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: '5.1 ความสามารถนำข้อมูลที่ทันสมัยมาใช้ในการให้คำปรึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic5_1 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic5_1),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic5_1,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '5.2 ใช้ภาษาเพื่อถ่ายทอดความคิดในการให้คำปรึกษาได้ดี',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic5_2 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic5_2),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic5_2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '5.3 มีความสามารถในการแก้ปัญหาเฉพาะหน้าให้กับนักศึกษาได้',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic5_3 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic5_3),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic5_3,

                  alignment: 'right',
                },
              ],

              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.getValue(
                    (this.Episode2.subtopic5_1 / this.dataAssessment.length +
                      this.Episode2.subtopic5_2 / this.dataAssessment.length +
                      this.Episode2.subtopic5_3 / this.dataAssessment.length) /
                      3
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.Total5),

                  alignment: 'right',
                },
                {
                  text: this.rating.Total5,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '6. คุณลักษณะด้านความรับผิดชอบ',
                  bold: true,
                },
                {},
                {},
                {},
              ],
              [
                {
                  text: '6.1 ใส่ใจการปฏิบัติหน้าที่ให้คำปรึกษา',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic6_1 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic6_1),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic6_1,

                  alignment: 'right',
                },
              ],
              [
                {
                  text: '6.2 จัดทำแฟ้มข้อมูลนักศึกษาให้เป็นปัจจุบันอยู่เสมอ',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic6_2 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic6_2),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic6_2,

                  alignment: 'right',
                },
              ],
              [
                {
                  text:
                    '6.3 ให้โอกาสนักศึกษา เข้ามารับคำปรึกษาอย่างสะดวกในบรรยากาศที่อบอุ่น',
                  margin: [15, 0, 0, 0],
                },
                {
                  text: this.getValue(
                    this.Episode2.subtopic6_3 / this.dataAssessment.length
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.subtopic6_3),

                  alignment: 'right',
                },
                {
                  text: this.rating.subtopic6_3,

                  alignment: 'right',
                },
              ],

              [
                {
                  text: 'รวม',
                  alignment: 'center',
                },
                {
                  text: this.getValue(
                    (this.Episode2.subtopic6_1 / this.dataAssessment.length +
                      this.Episode2.subtopic6_2 / this.dataAssessment.length +
                      this.Episode2.subtopic6_3 / this.dataAssessment.length) /
                      3
                  ),

                  alignment: 'right',
                },
                {
                  text: this.getValue(this.totalSD.Total6),

                  alignment: 'right',
                },
                {
                  text: this.rating.Total6,

                  alignment: 'right',
                },
              ],
            ],
          },
        },
        { text: '', pageBreak: 'before', columns: data_st },
      ],

      defaultStyle: {
        font: 'THSarabunNew',
        fontSize: 14,
      },
    };
    pdfMake.createPdf(dd).open();
  }

  //else {
  //}
  // } else {
  //   alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
  // }

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

  public async createDOC() {
    var data_row = [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                pageBreakBefore: true,
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: 'ลำดับ',
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
                    text: 'ความคิดเห็น',
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
    for (var i = 0; i < this.commentAssessment.length; i++) {
      let dataaaa2 = new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    font: 'TH SarabunPSK',
                    text: `${i + 1}`,

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
                    text: this.commentAssessment[i],
                    bold: true,
                    size: 32,
                  }),
                ],
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
        ],
      });
      data_row.push(dataaaa2);
    }
    const doc = new Document();
    doc.addSection({
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'ผลประเมินความพึงพอใจในการให้บริการให้คำปรึกษาและแนะแนวของอาจารย์ที่ปรึกษา',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ปีการศึกษา' + ' ' + this.assessment_year.value._year,
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
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ส่วนที่ 1 ข้อมูลส่วนตัว',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'จำนวน',
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
                          text: 'ร้อยละ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '1. เพศ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',
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
                          text: '',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),

            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'เพศชาย',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.count_men}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.count_men * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'เพศหญิง',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.count_women}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.count_women * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',
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
                          text: `${this.dataAssessment.length}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.dataAssessment.length * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '2. ระดับการศึกษา',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',
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
                          text: '',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ปวส.',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.level1}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.level1 * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ปริญญาตรี',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.level2}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.level2 * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',
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
                          text: `${this.dataAssessment.length}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.dataAssessment.length * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  columnSpan: 3,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '3. ' +
                            this.dataBranch_Faculty.faculty +
                            ' ' +
                            this.dataBranch_Faculty.branch,
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '4. ความถี่ในการใช้บริการ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',
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
                          text: '',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ไม่เคยมารับบริการ',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.frequency_never}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.frequency_never * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'น้อยกว่า 5 ครั้ง',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.frequency_less}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.frequency_less * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'มากกว่า 5 ครั้ง',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.frequency_over}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.frequency_over * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',
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
                          text: `${this.dataAssessment.length}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.dataAssessment.length * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '5. เข้ารับบริการเรื่อง',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',
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
                          text: '',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ข้อมูลเรื่องอาชีพ',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.service_career}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.service_career * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ข้อมูลเรื่องการศึกษา',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.service_study}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.service_study * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ทุนการศึกษา',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.service_bursary}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.service_bursary * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ข้อมูลบุคลิกภาพ ธรรมะ สุขภาพและการปรับตัว',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.service_personality}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.service_personality * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'บริการศิษย์เก่า',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.service_alumni}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.service_alumni * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'อื่นๆ',
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: `${this.Episode1.service_other}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.Episode1.service_other * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],

                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',
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
                          text: `${this.dataAssessment.length}`,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            (this.dataAssessment.length * 100) /
                              this.dataAssessment.length
                          ),
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
          ],

          alignment: AlignmentType.CENTER,
        }),

        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  rowSpan: 2,
                  children: [
                    new Paragraph({
                      pageBreakBefore: true,
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'หัวข้อประเมิน',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),

                new TableCell({
                  columnSpan: 3,
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'ระดับความพึงพอใจ (ร้อยละ)',
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
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'x',
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
                          text: 'S.D.',
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
                          text: 'ระดับความพึงพอใจ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.CENTER,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '1. คุณลักษณะด้านความสามารถเชิงวิชาการ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '1.1 รู้บทบาทหน้าที่ของอาจารย์ที่ปรึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic1_1 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic1_1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic1_1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '1.2 มีเทคนิคให้คำปรึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic1_2 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic1_2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic1_2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '1.3 มีความสามารถให้คำแนะนำ',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic1_3 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic1_3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic1_3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '1.4 มีความรู้เกี่ยวกับกฎระเบียบของมหาวิทยาลัย',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic1_4 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic1_4),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic1_4,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '1.5 มีความรู้ความสนใจเกี่ยวกับเหตุการณ์ปัจจุบัน',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic1_5 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic1_5),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic1_5,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',

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
                          text: this.getValue(
                            (this.Episode2.subtopic1_1 /
                              this.dataAssessment.length +
                              this.Episode2.subtopic1_2 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic1_3 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic1_4 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic1_5 /
                                this.dataAssessment.length) /
                              5
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.Total1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.Total1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '2. คุณลักษณะด้านบุคลิกภาพ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '2.1 มีความประพฤติแบบอย่างที่ดี มีความกระตือรือร้นสนใจในหน้าที่',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic2_1 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic2_1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic2_1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '2.2 รับฟังความคิดเห็นของนักศึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic2_2 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic2_2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic2_2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '2.3 มีบุคลิกภาพที่อบอุ่นและสุภาพเรียบร้อย สุขุมรอบคอบคุมอารมณ์',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic2_3 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic2_3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic2_3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '2.4 เอาใจใส่นักศึกษาอย่างทั่วถึงกันและสม่ำเสมอเท่าเทียมกัน',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic2_4 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic2_4),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic2_4,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '2.5 มีความพร้อมในการช่วยเหลือให้นักศึกษาเผชิญกับปัญหาต่างๆ',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic2_5 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic2_5),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic2_5,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',

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
                          text: this.getValue(
                            (this.Episode2.subtopic2_1 /
                              this.dataAssessment.length +
                              this.Episode2.subtopic2_2 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic2_3 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic2_4 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic2_5 /
                                this.dataAssessment.length) /
                              5
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.Total2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.Total2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '3. คุณลักษณะด้านเจตคติ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '3.1 มีความเต็มใจและยินดีในการทำหน้าที่อาจารย์ที่ปรึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic3_1 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic3_1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic3_1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '3.2 มีความมุ่งมั่นต่อคุณภาพงานการให้คำปรึกษาด้านวิชาการ',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic3_2 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic3_2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic3_2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '3.3 การเป็นคนมองโลกในแง่ดี',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic3_3 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic3_3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic3_3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '3.4 การให้ความสำคัญกับนักศึกษาทุกคนเท่าเทียมกัน',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic3_4 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic3_4),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic3_4,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '3.5 มีความยุติธรรมแก่นักศึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic3_5 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic3_5),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic3_5,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',

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
                          text: this.getValue(
                            (this.Episode2.subtopic3_1 /
                              this.dataAssessment.length +
                              this.Episode2.subtopic3_2 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic3_3 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic3_4 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic3_5 /
                                this.dataAssessment.length) /
                              5
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.Total3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.Total3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '4. คุณลักษณะด้านจรรยาบรรณ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '4.1 รักษาความลับ ข้อมูลส่วนตัวของนักศึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic4_1 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic4_1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic4_1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '4.2 คำนึงถึงสวัสดิภาพของนักศึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic4_2 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic4_2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic4_2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '4.3 การให้กำลังใจแก่นักศึกษาที่เข้ามาขอรับคำปรึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic4_3 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic4_3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic4_3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '4.4 มีความเมตตา และกรุณากับนักศึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic4_4 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic4_4),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic4_4,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',

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
                          text: this.getValue(
                            (this.Episode2.subtopic4_1 /
                              this.dataAssessment.length +
                              this.Episode2.subtopic4_2 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic4_3 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic4_4 /
                                this.dataAssessment.length) /
                              4
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.Total4),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.Total4,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '5. คุณลักษณะด้านทักษะการปฏิบัติงาน',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '5.1 ความสามารถนำข้อมูลที่ทันสมัยมาใช้ในการให้คำปรึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic5_1 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic5_1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic5_1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '5.2 ใช้ภาษาเพื่อถ่ายทอดความคิดในการให้คำปรึกษาได้ดี',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic5_2 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic5_2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic5_2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '5.3 มีความสามารถในการแก้ปัญหาเฉพาะหน้าให้กับนักศึกษาได้',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic5_3 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic5_3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic5_3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',

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
                          text: this.getValue(
                            (this.Episode2.subtopic5_1 /
                              this.dataAssessment.length +
                              this.Episode2.subtopic5_2 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic5_3 /
                                this.dataAssessment.length) /
                              3
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.Total5),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.Total5,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '6. คุณลักษณะด้านความรับผิดชอบ',
                          bold: true,
                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: '6.1 ใส่ใจการปฏิบัติหน้าที่ให้คำปรึกษา',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic6_1 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic6_1),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic6_1,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '6.2 จัดทำแฟ้มข้อมูลนักศึกษาให้เป็นปัจจุบันอยู่เสมอ',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic6_2 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic6_2),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic6_2,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text:
                            '6.3 ให้โอกาสนักศึกษา เข้ามารับคำปรึกษาอย่างสะดวกในบรรยากาศที่อบอุ่น',

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.LEFT,
                    }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(
                            this.Episode2.subtopic6_3 /
                              this.dataAssessment.length
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.subtopic6_3),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.subtopic6_3,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: 'รวม',

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
                          text: this.getValue(
                            (this.Episode2.subtopic6_1 /
                              this.dataAssessment.length +
                              this.Episode2.subtopic6_2 /
                                this.dataAssessment.length +
                              this.Episode2.subtopic6_3 /
                                this.dataAssessment.length) /
                              3
                          ),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.getValue(this.totalSD.Total6),

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),

                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({
                          font: 'TH SarabunPSK',
                          text: this.rating.Total6,

                          size: 32,
                        }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                }),
              ],
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),

        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: data_row,

          alignment: AlignmentType.CENTER,
        }),
      ],
    });
    Packer.toBlob(doc).then((blob) => {
      saveAs(
        blob,
        `Assessment_${this.nameGroup}_${this.assessment_year.value._year}.docx`
      );
    });
  }
}
