import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss'],
})
export class AdviceDataComponent implements OnInit {
  public dataFaculty: any = null;
  public codeFaculty: any = null;
  public dataMajor: any = null;
  public nameMajor: any = null;
  public acronym: any = null;
  public codeMajor: any = null;
  public dataBranch: any = null;
  public codeBranch: any = null;
  public dataGroup: any = null;
  public groupID: any = null;
  public groupUser_name: any = null;
  public nameBranchhead: any = null;
  public dataAdvice: any = null;
  public thday = new Array(
    'วันอาทิตย์ ที่',
    'วันจันทร์ ที่',
    'วันอังคาร ที่',
    'วันพุธ ที่',
    'วันพฤหัส ที่',
    'วันศุกร์ ที่',
    'วันเสาร์ ที่'
  );
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
  public dataStudent: any = null;
  public dataStudent_id: any = null;
  public dataAppointment_Student: any = null;

  public dataReply_id = {
    subject_advice: null,
    detail: null,
    reply: null,
    reply_id: null,
    advice_advisor: null,
    reply_advice_file: null,
  };

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
  }

  ngOnInit(): void {}

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
    this.dataStudent_id = null;
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
    this.dataStudent_id = null;
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

    // formData.append('ID', this.codeMajor);
    // let getData2: any = await this.http.post('admin/getTeacher', formData);
    // if (getData2.connect) {
    //   if (getData2.response.rowCount > 0) {
    //     this.dataTeacher = getData2.response.result;
    //   } else {
    //     this.dataTeacher = null;
    //   }
    // } else {
    //   alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    // }
    this.getBranchhead();
    // this.getGroup();
  }

  public clickBranch(codeBranch, name, acronym) {
    this.dataStudent_id = null;
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
    this.dataStudent_id = null;
    this.groupID = codeGroup;
    // this.groupName = namegroup;
    this.groupUser_name = titlename + fname + ' ' + lname;
    this.getStudent();
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

  public getAdvice = async () => {
    let formData = new FormData();
    formData.append('ID', this.dataStudent_id);
    let getData: any = await this.http.post('admin/getAdvice', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvice = getData.response.result;
      } else {
        this.dataAdvice = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
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

  public getStudent = async () => {
    let formData = new FormData();
    formData.append('group', this.groupID);
    let getData: any = await this.http.post('admin/getStudent', formData);
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

  async clickStudent(data: any) {
    this.dataStudent_id = data.userID;
    this.getAdvice();
  }
  clickReply_data(dataReply: any) {
    this.dataReply_id.subject_advice = dataReply.subject_advice;
    this.dataReply_id.detail = dataReply.detail;
    this.dataReply_id.reply = dataReply.reply;
    this.dataReply_id.reply_id = dataReply.reply_advice_id;
    this.dataReply_id.advice_advisor = dataReply.advice_advisor;
    this.dataReply_id.reply_advice_file = dataReply.reply_advice_file;
    this.getReply_Student();
  }
  async getReply_Student() {
    let formData = new FormData();
    formData.append('ID', this.dataReply_id.reply_id);
    let getData: any = await this.http.post(
      'teacher/getAppointment_Student',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAppointment_Student = getData.response.result;
      } else {
        this.dataAppointment_Student = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }
}
