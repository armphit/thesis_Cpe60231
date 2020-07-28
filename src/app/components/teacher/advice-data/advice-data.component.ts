import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss'],
})
export class AdviceDataComponent implements OnInit {
  public codeGroup: any = null;
  public dataGroup: any = null;
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
  public dataReply = {
    subject_advice: null,
    detail: null,
    advice_id: null,
    reply_advice: null,
  };
  public dataAdvice_notNull: any = null;
  public fileAdvice: File;
  public formAdvice: FormGroup;
  public formAppointment: FormGroup;
  public thDate: any = null;
  public dataReply_id = {
    subject_advice: null,
    detail: null,
    reply: null,
    reply_id: null,
  };
  public dataUpdateReply = {
    subject_advice: null,
    detail: null,
    reply: null,
    reply_id: null,
  };
  public dataStudent: any = null;
  public dataReply_Student: any = null;
  public adviceUser: any = null;
  public dataAppointment_Student: any = null;
  public app_detail: string = null;
  public reply_advice_id: string = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
  }

  ngOnInit(): void {
    this.formAdvice = this.formBuilder.group({
      replyAdvice: ['', Validators.required],
    });

    this.formAppointment = this.formBuilder.group({
      suggestion: ['', Validators.required],
      detail: [''],
      to: ['', Validators.required],
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
    this.getAdvice();
    this.getAdvice_notNull();
    this.getStudent();
  }

  public getAdvice = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post('teacher/getAdvice', formData);
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

  public getDate(date: any) {
    var d = new Date(date);

    return (
      this.thday[d.getDay()] +
      '  ' +
      d.getDate() +
      '  ' +
      this.thmonth[d.getMonth()] +
      '  ' +
      (d.getFullYear() + 543)
    );
  }
  public clickReply(dataReply) {
    this.dataReply.subject_advice = dataReply.subject_advice;
    this.dataReply.detail = dataReply.detail;
    this.dataReply.advice_id = dataReply.advice_id;

    this.fileAdvice = null;
    this.getYear();
    this.formAdvice.reset();
  }

  public getAdvice_notNull = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post(
      'teacher/getAdvice_notNull',
      formData
    );
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvice_notNull = getData.response.result;
      } else {
        this.dataAdvice_notNull = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public uploadFileAdvice(file) {
    if (file) {
      this.fileAdvice = file;
    }
  }

  public getYear = () => {
    var now = new Date();

    this.thDate =
      this.thday[now.getDay()] +
      ' ' +
      now.getDate() +
      ' ' +
      'เดือน' +
      this.thmonth[now.getMonth()] +
      ' ' +
      'พ.ศ.' +
      (0 + now.getFullYear() + 543);
  };

  public insertReplyAdvice = async () => {
    let formData = new FormData();
    var now = new Date();
    var date =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('reply', this.formAdvice.value.replyAdvice);
    formData.append('adviceID', this.dataReply.advice_id);
    formData.append('upload', this.fileAdvice);
    formData.append('dateNow', date);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });

    let getData: any = await this.http.post('teacher/addReplyAdvice', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#reply_advice').modal('hide');
        this.getAdvice();
        this.getAdvice_notNull();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  clickReply_data(dataReply: any) {
    this.dataReply_id.subject_advice = dataReply.subject_advice;
    this.dataReply_id.detail = dataReply.detail;
    this.dataReply_id.reply = dataReply.reply;
    this.dataReply_id.reply_id = dataReply.reply_advice_id;
    this.formAppointment.reset();
  }

  public insertAppointment = async () => {
    const momentDate = new Date(this.formAppointment.value.to);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    if (this.formAppointment.value.detail == null) {
      this.formAppointment.value.detail = '';
    }
    let formData = new FormData();
    formData.append('suggestion', this.formAppointment.value.suggestion);
    formData.append('detail', this.formAppointment.value.detail);
    formData.append('reply_adviceID', this.dataReply_id.reply_id);
    formData.append('dateNow', formattedDate);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });
    let getData: any = await this.http.post('teacher/addAppointment', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addAppointment').modal('hide');
        this.getReply_Student();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  clickUpdateReply(dataReply: any) {
    this.dataUpdateReply.subject_advice = dataReply.subject_advice;
    this.dataUpdateReply.detail = dataReply.detail;
    this.dataUpdateReply.reply_id = dataReply.reply_advice_id;

    this.formAdvice = this.formBuilder.group({
      replyAdvice: [dataReply.reply, Validators.required],
    });
  }

  public updateReplyAdvice = async () => {
    let formData = new FormData();
    var now = new Date();
    var date =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    formData.append('reply', this.formAdvice.value.replyAdvice);
    formData.append('adviceID', this.dataUpdateReply.reply_id);
    formData.append('dateNow', date);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });

    let getData: any = await this.http.post('teacher/updateReply', formData);
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#updateAdvice').modal('hide');
        this.getAdvice_notNull();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public deleteReplyAdvice = async (dataReply: any) => {
    let formData = new FormData();
    formData.append('ID', dataReply.reply_advice_id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('teacher/delReply', formData);
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
            this.getAdvice_notNull();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  public getStudent = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post('teacher/getStudent', formData);
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
    this.adviceUser = data.userID;
    let formData = new FormData();
    formData.append('ID', data.userID);
    let getData: any = await this.http.post(
      'teacher/getReply_Student',
      formData
    );
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataReply_Student = getData.response.result;
      } else {
        this.dataReply_Student = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }

  async clickReply_Student(data: any) {
    this.reply_advice_id = data.reply_advice_id;
    this.getReply_Student();
  }
  async getReply_Student() {
    let formData = new FormData();
    formData.append('ID', this.reply_advice_id);
    let getData: any = await this.http.post(
      'teacher/getAppointment_Student',
      formData
    );
    console.log(getData);
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

  public deleteAppointment = async (data: any) => {
    let formData = new FormData();
    formData.append('ID', data.app_id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delAppointment',
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
            this.getReply_Student();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  async clickUpdateAppointment(data: any) {
    this.formAppointment = this.formBuilder.group({
      suggestion: [data.app_suggestion, Validators.required],
      detail: [data.app_detail],
      to: [data.app_date, Validators.required],
      id: [data.app_id, Validators.required],
    });
  }

  public updateAppointment = async () => {
    const momentDate = new Date(this.formAppointment.value.to);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');

    if (this.formAppointment.value.detail == null) {
      this.formAppointment.value.detail = '';
    }
    let formData = new FormData();
    formData.append('suggestion', this.formAppointment.value.suggestion);
    formData.append('detail', this.formAppointment.value.detail);
    formData.append('ID', this.formAppointment.value.id);
    formData.append('dateNow', formattedDate);

    let getData: any = await this.http.post(
      'teacher/updateAppointment',
      formData
    );
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#updateAppointment').modal('hide');
        this.getReply_Student();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
}
