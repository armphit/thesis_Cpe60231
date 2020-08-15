import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss'],
})
export class AdviceDataComponent implements OnInit {
  public codeGroup: any = null;
  public dataGroup: any = null;
  public dataAdvice: any = null;

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
    advice_Advisor: null,
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
    advice_advisor: null,
    reply_advice_file: null,
  };
  public dataUpdateReply = {
    subject_advice: null,
    detail: null,
    reply: null,
    reply_id: null,
    advice_Advisor: null,
    date: null,
  };
  public dataStudent: any = null;
  public dataReply_Student: any = null;
  public adviceUser: any = null;
  public dataAppointment_Student: any = null;
  public app_detail: string = null;
  public reply_advice_id: string = null;
  public advice_year: FormGroup;
  public range: Array<any> = [];
  public dataStudent_Advice: any = null;
  public inAdvice: FormGroup;
  public year_now: any = null;
  public filesName: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getCURDATE();
    this.getYear();
  }

  ngOnInit(): void {
    this.formAdvice = this.formBuilder.group({
      replyAdvice: ['', Validators.required],
    });

    this.inAdvice = this.formBuilder.group({
      subject: ['', Validators.required],
      details: ['', Validators.required],
      student: ['', Validators.required],
    });

    this.formAppointment = this.formBuilder.group({
      suggestion: ['', Validators.required],
      detail: [''],
      to: ['', Validators.required],
    });

    this.advice_year = this.formBuilder.group({
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
  public clickGroup(codeGroup) {
    this.adviceUser = null;
    this.reply_advice_id = null;
    this.codeGroup = codeGroup;
    this.getAdvice();
    this.getAdvice_notNull();
    this.getStudent();
  }

  public getAdvice = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.advice_year.value._year);
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
      'วันที่' +
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
    this.dataReply.advice_Advisor = dataReply.advice_advisor;

    this.fileAdvice = null;
    this.filesName = null;
    this.getYear();
    this.formAdvice.reset();
    console.log(this.dataReply.advice_Advisor);
  }

  public getAdvice_notNull = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.advice_year.value._year);
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
      this.filesName = file.name;
    }
  }

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
    if (this.fileAdvice == null) {
      Swal.fire('โปรดเลือกไฟล์', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'teacher/addReplyAdvice',
        formData
      );
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
    }
  };

  async clickReply_data(dataReply: any) {
    this.dataReply_id.subject_advice = dataReply.subject_advice;
    this.dataReply_id.detail = dataReply.detail;
    this.dataReply_id.reply = dataReply.reply;
    this.dataReply_id.reply_id = dataReply.reply_advice_id;
    this.dataReply_id.advice_advisor = dataReply.advice_advisor;
    this.dataReply_id.reply_advice_file = dataReply.reply_advice_file;
    this.formAppointment.reset();
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

  public insertAppointment = async () => {
    const momentDate = new Date(this.formAppointment.value.to);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    const currentDate = new Date();
    const formattedCurrentDate = moment(currentDate).format('YYYY-MM-DD');

    if (this.formAppointment.value.detail == null) {
      this.formAppointment.value.detail = '';
    }
    let formData = new FormData();
    formData.append('suggestion', this.formAppointment.value.suggestion);
    formData.append('detail', this.formAppointment.value.detail);
    formData.append('reply_adviceID', this.dataReply_id.reply_id);
    formData.append('dateNow', formattedDate);

    if (formattedDate < formattedCurrentDate) {
      Swal.fire('วันที่ไม่ถูกต้อง', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'teacher/addAppointment',
        formData
      );
      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
          let win: any = window;
          win.$('#addAppointment').modal('hide');
          this.getAppointment_Student();
          //this.getReply_Student();
          this.getStudent();
        } else {
          Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  clickUpdateReply(dataReply: any) {
    this.dataUpdateReply.subject_advice = dataReply.subject_advice;
    this.dataUpdateReply.detail = dataReply.detail;
    this.dataUpdateReply.reply_id = dataReply.reply_advice_id;
    this.dataUpdateReply.date = dataReply.reply_advice_date;
    this.dataUpdateReply.advice_Advisor = dataReply.advice_advisor;
    this.fileAdvice = null;
    this.filesName = null;
    this.formAdvice = this.formBuilder.group({
      replyAdvice: [dataReply.reply, Validators.required],
    });
  }

  public updateReplyAdvice = async () => {
    let formData = new FormData();

    formData.append('reply', this.formAdvice.value.replyAdvice);
    formData.append('adviceID', this.dataUpdateReply.reply_id);
    formData.append('dateNow', this.dataUpdateReply.date);
    formData.append('advisor', this.dataUpdateReply.advice_Advisor);
    formData.append('upload', this.fileAdvice);
    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });

    let getData: any = await this.http.post('teacher/updateReply', formData);

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
            this.getStudent();
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
    formData.append('year', this.advice_year.value._year);
    this.advice_year;
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

  public async clickStudent(data: any) {
    this.adviceUser = data.userID;
    this.reply_advice_id = null;
    this.getReply_Student();
  }
  public async getReply_Student() {
    let formData = new FormData();
    formData.append('ID', this.adviceUser);
    formData.append('year', this.advice_year.value._year);

    let getData: any = await this.http.post(
      'teacher/getReply_Student',
      formData
    );
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
    this.getAppointment_Student();
  }
  async getAppointment_Student() {
    let formData = new FormData();
    formData.append('ID', this.reply_advice_id);
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
            this.getAppointment_Student();
            this.getReply_Student();
            this.getStudent();
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
    const currentDate = new Date();
    const formattedCurrentDate = moment(currentDate).format('YYYY-MM-DD');

    if (this.formAppointment.value.detail == null) {
      this.formAppointment.value.detail = '';
    }
    let formData = new FormData();
    formData.append('suggestion', this.formAppointment.value.suggestion);
    formData.append('detail', this.formAppointment.value.detail);
    formData.append('ID', this.formAppointment.value.id);
    formData.append('dateNow', formattedDate);

    if (formattedDate < formattedCurrentDate) {
      Swal.fire('วันที่ไม่ถูกต้อง', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'teacher/updateAppointment',
        formData
      );

      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
          let win: any = window;
          win.$('#updateAppointment').modal('hide');
          this.getAppointment_Student();
        } else {
          Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
        }
      } else {
        alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
      }
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
        this.year_now = getData.response.result[0].year;
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

  public getYearAdvice(e) {
    this.reply_advice_id = null;
    this.advice_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getAdvice();
    this.getAdvice_notNull();
    this.getStudent();
    this.adviceUser = null;
    // this.getCalendar();
  }
  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };
  public async getStudent_Advice() {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post(
      'teacher/getGoodnessStudent',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataStudent_Advice = getData.response.result;
      } else {
        this.dataStudent_Advice = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }
  public clickAddAdvice_Teacher() {
    this.inAdvice.reset();
    this.getStudent_Advice();
  }

  public insertAdvice = async () => {
    let formData = new FormData();
    var now = new Date();
    var date =
      now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();

    formData.append('ID', this.inAdvice.value.student);
    formData.append('group', this.codeGroup);
    formData.append('subject', this.inAdvice.value.subject);
    formData.append('details', this.inAdvice.value.details);
    formData.append('dateNow', date);
    formData.append('year_study', this.year_now);
    formData.append(
      'teacher',
      JSON.parse(localStorage.getItem('userLogin')).userID
    );
    // formData.forEach((value,key) => {
    //   console.log(key+":"+value)
    // });

    let getData: any = await this.http.post('teacher/addAdvice', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addAdvice_Teacher').modal('hide');
        this.getAdvice();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public clickUpdateAdvice(i) {
    this.getStudent_Advice();
    this.inAdvice = this.formBuilder.group({
      subject: [i.subject_advice, Validators.required],
      details: [i.detail, Validators.required],
      student: [i.adviceUser, Validators.required],
      advice_id: [i.advice_id, Validators.required],
    });
  }

  public updateAdvice = async () => {
    let formData = new FormData();
    formData.append('subject', this.inAdvice.value.subject);
    formData.append('detail', this.inAdvice.value.details);
    formData.append('student', this.inAdvice.value.student);

    formData.append('code', this.inAdvice.value.advice_id);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });
    let getData: any = await this.http.post('teacher/editAdvice', formData);
    console.log(getData);
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

  public clickPDF() {
    // let data = document.getElementById('divId');
    // html2canvas(data).then((canvas) => {
    //   const contentDataURL = canvas.toDataURL('image/png');
    //   let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
    //   // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
    //   pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);
    //   pdf.save('Filename.pdf');
    // });
    console.log('dada');
    const doc = new jspdf();
    doc.text('hello', 70, 70);
    doc.save('this..pdf');
  }
}
