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
  public assessment_year: FormGroup;
  public dataFaculty: any = null;
  public codeFaculty: any = null;
  public dataMajor: any = null;
  public nameMajor: any = null;
  public acronym: any = null;
  public codeMajor: any = null;
  public dataBranch: any = null;
  public codeBranch: any = null;
  public dataGroup: any = null;
  public groupName: any = null;

  public groupID: any = null;
  public groupUser_name: any = null;
  public nameBranchhead: any = null;
  public range: Array<any> = [];
  public dataAssessment: any = null;
  public commentAssessment: Array<any> = [];
  public data: any = null;
  public filesName: any = 'โปรดเลือกไฟล์';
  public fileExcel: File;
  public filesName_Excel: any = 'โปรดเลือกไฟล์';
  public dataFileExcel: any = null;
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
  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
    this.getYear();
    this.getCURDATE();
    this.getFileExcel();
  }

  ngOnInit(): void {
    this.assessment_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
  }

  public getFaculty = async () => {
    let getData: any = await this.http.post('admin/getFaculty');
    if (getData.connect) {
      if (getData['response']['rowCount'] > 0) {
        this.dataFaculty = getData['response']['result'];
      } else {
        this.dataFaculty = [];
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public async clickFaculty(codeFaculty, nameFaculty) {
    this.codeMajor = null;
    this.codeBranch = null;

    this.groupID = null;
    this.codeFaculty = codeFaculty.substr(0, 2);
    let formData = new FormData();
    formData.append('code', this.codeFaculty);
    let getData: any = await this.http.post('admin/getMajor', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataMajor = getData.response.result;
      } else {
        this.dataMajor = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }

  public async clickMajor(codeMajor, nameMajor, acronym) {
    this.codeBranch = null;

    this.groupID = null;
    this.nameMajor = nameMajor;
    this.codeMajor = codeMajor;
    let formData = new FormData();
    formData.append('code', this.codeMajor);
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
    this.getBranchhead();
    // this.getGroup();
  }

  public clickBranch(codeBranch, name, acronym) {
    this.groupID = null;
    this.acronym = acronym;
    this.codeBranch = codeBranch;
    this.getGroup();
  }

  public getGroup = async () => {
    let formData = new FormData();
    formData.append('codeBranch', this.codeBranch);
    let getData: any = await this.http.post('admin/getGroup', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGroup = getData.response.result;
      } else {
        this.dataGroup = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public async clickGroup(
    codeGroup: any,
    namegroup: any,
    titlename: any,
    fname: any,
    lname: any
  ) {
    this.groupID = codeGroup;
    this.groupName = namegroup;
    this.groupUser_name = titlename + fname + ' ' + lname;
    // this.getStudent();
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

  public getBranchhead = async () => {
    let formData = new FormData();
    formData.append('code', this.codeMajor);
    let getData: any = await this.http.post('admin/getBranchhead', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        let a =
          getData.response.result[0].titlename +
          getData.response.result[0].fname +
          ' ' +
          getData.response.result[0].lname;

        if (a == '0 null') {
          a = '';
          this.nameBranchhead = a;
        } else {
          this.nameBranchhead = a;
        }
      } else {
        this.nameBranchhead = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getYearAssessment(e) {
    this.filesName = 'โปรดเลือกไฟล์';
    this.data = null;
    this.fileExcel = null;
    this.filesName_Excel = 'โปรดเลือกไฟล์';
    this.assessment_year = this.formBuilder.group({
      _year: [e, Validators.required],
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
        this.assessment_year.patchValue({
          _year: getData.response.result[0].year,
        });
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getAssessment = async () => {
    var a = null;
    var b = null;
    let formData = new FormData();

    a = this.groupName.split('.', 1);
    b = this.groupName.replace(a + '.', '');

    formData.append('group', this.groupID);
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
    let formData = new FormData();
    formData.append('ID', this.groupID);
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
        Form.append('group', this.groupID);
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
  public delAssessment = async () => {
    let formData = new FormData();
    formData.append('group', this.groupID);
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
}
