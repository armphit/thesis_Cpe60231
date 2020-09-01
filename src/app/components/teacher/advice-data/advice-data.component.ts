import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import * as moment from 'moment';
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
    year: null,
    nameStudent: null,
    faculty: null,
    brunch: null,
    nameTeacher: null,
    group: null,
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
  public nameGroup: any = null;

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
  public clickGroup(codeGroup, group_name) {
    this.adviceUser = null;
    this.reply_advice_id = null;
    this.codeGroup = codeGroup;
    this.nameGroup = group_name;
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
    if (this.dataReply.advice_Advisor != null && this.fileAdvice == null) {
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
    this.dataReply_id.nameStudent =
      dataReply.titlename + dataReply.fname + ' ' + dataReply.lname;
    this.dataReply_id.faculty = dataReply.n;
    this.dataReply_id.brunch = dataReply.name;
    this.dataReply_id.nameTeacher =
      dataReply.t + dataReply.f + ' ' + dataReply.l;
    this.dataReply_id.group = dataReply.study_group_name;
    this.dataReply_id.year = dataReply.year_study;
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

  public async clickPDF_st() {
    var date = new Date();
    let a = this.dataReply_id.group.split('.', 1);
    let b = this.dataReply_id.group.replace(a + '.', '');
    let c = String(date.getFullYear() + 543);
    let d = c.substring(2);
    let e = b.substring(0, 2);
    let f = Number(d) - Number(e) + 1;
    let g = null;
    let h = null;
    let data_st = null;
    let data_aap = null;
    let j = null;
    if (b.substring(4) == '1') {
      g = 'ปกติ';
    } else if (b.substring(4) == '2') {
      g = 'บ่าย';
    } else if (b.substring(4) == '3') {
      g = 'สมทบ';
    }
    if (this.dataAppointment_Student != null) {
      h = 'มีนัดพบติดตามผลดังตาราง';
      j =
        '\n*** เก็บไว้ที่งานแนะแนวการศึกษาและอาชีพ กองพัฒนานักศึกษา/อาจารย์ที่ปรึกษา/แผนกงานพัฒนานักศึกษา คณะฯ';
      data_st = [
        { width: '*', text: '' },
        {
          width: 'auto',
          table: {
            headerRows: 1,
            widths: [120, 250, 100],
            body: [
              [
                {
                  text: 'ว/ด/ป',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },
                {
                  text: 'ผลที่เกิด/คำแนะนำเพิ่มเติม',
                  style: 'tableHeader',
                  alignment: 'center',
                  bold: true,
                },

                {
                  text: 'หมายเหตุ',
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
      for (var i = 0; i < this.dataAppointment_Student.length; i++) {
        var formattedDate = new Date(this.dataAppointment_Student[i].app_date);
        const date =
          'วันที่' +
          '  ' +
          formattedDate.getDate() +
          '  ' +
          this.thmonth[formattedDate.getMonth()] +
          '  ' +
          (formattedDate.getFullYear() + 543);

        let dataaaa2 = [
          {
            text: date,
            style: '',
            alignment: '',
            bold: false,
          },
          {
            text: this.dataAppointment_Student[i].app_suggestion,
            style: '',
            alignment: '',
            bold: false,
          },
          {
            text: this.dataAppointment_Student[i].app_detail,
            style: '',
            alignment: '',
            bold: false,
          },
        ];
        data_st[1]['table']['body'].push(dataaaa2);
      }
      data_aap = { pageBreak: 'before', columns: data_st, fontSize: 16 };
    } else if (this.dataAppointment_Student == null) {
      h = 'ไม่มีนัดพบติดตามผล';
      j = '';
      data_st = [{ text: '' }];
      data_aap = { columns: data_st, fontSize: 16 };
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
        {
          text:
            'แบบบันทึกการบริการให้คำปรึกษาและแนะแนวมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน',
          fontSize: 16,
          alignment: 'center',
          bold: true,
        },
        {
          text: 'ประจำปีการศึกษา ' + this.dataReply_id.year,
          fontSize: 16,
          alignment: 'center',
          bold: true,
        },
        {
          text: 'ที่ มทร. อีสาน',
          fontSize: 16,
          alignment: 'right',
          bold: true,
        },
        {
          text:
            '.........................................................................................................................................................',
          fontSize: 16,
          alignment: 'center',
          bold: true,
        },
        {
          text: 'ข้อมูลนักศึกษา',
          fontSize: 16,
          alignment: 'left',
          bold: true,
        },
        {
          text: 'ชื่อ – สกุล' + '  ' + this.dataReply_id.nameStudent,
          fontSize: 16,
          alignment: 'left',
        },
        {
          text:
            'นักศึกษา' +
            this.dataReply_id.faculty +
            '  ' +
            this.dataReply_id.brunch,
          fontSize: 16,
          alignment: 'left',
        },
        {
          text: 'ชั้นปีที่' + ' ' + f + '  ' + 'รอบ' + ' ' + g,
          fontSize: 16,
          alignment: 'left',
        },
        {
          text:
            'ขอรับการให้คำปรึกษาแนะแนวในเรื่อง (สรุปปัญหาโดยย่อ)' +
            ' ' +
            this.dataReply_id.detail,
          fontSize: 16,
          alignment: 'left',
        },
        {
          text:
            '\nลงชื่อ.................................................................\n( ' +
            this.dataReply_id.nameStudent +
            ' )',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'บันทึกของอาจารย์ที่ปรึกษา/ผู้ให้คำปรึกษา',
          fontSize: 16,
          alignment: 'left',
          bold: true,
        },

        {
          text: this.dataReply_id.reply,
          fontSize: 16,
          alignment: 'left',
        },
        {
          text:
            '\nลงชื่อ.................................................................\n( ' +
            this.dataReply_id.nameTeacher +
            ' )',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'ติดตามผล',
          fontSize: 16,
          alignment: 'left',
          decoration: 'underline',
        },
        {
          text: h,
          fontSize: 16,
          alignment: 'left',
        },
        data_aap,
        {
          text: j,
          fontSize: 16,
          alignment: 'center',
        },
      ],

      defaultStyle: {
        font: 'THSarabunNew',
      },
    };

    pdfMake.createPdf(dd).open();
  }
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
  public async clickPDF_group() {
    let formData = new FormData();
    formData.append('ID', this.codeGroup);
    let getData: any = await this.http.post(
      'teacher/getBranch_Faculty',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        let branch = getData.response.result[0].NAME;
        let faculty = getData.response.result[0].n;
        var date = new Date();
        let a = this.nameGroup.split('.', 1);
        let b = this.nameGroup.replace(a + '.', '');
        let c = String(date.getFullYear() + 543);
        let d = c.substring(2);
        let e = b.substring(0, 2);
        let f = Number(d) - Number(e) + 1;
        let g = String(branch.split(' ', 1));
        let data_st = [
          { width: '*', text: '' },
          {
            width: 'auto',
            table: {
              headerRows: 1,
              widths: [60, 90, 90, 90, 80, 60],
              body: [
                [
                  {
                    text: 'วัน เดือน ปี',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },
                  {
                    text: 'ชื่อ-สกุล นักศึกษา',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },

                  {
                    text: 'เรื่องที่นักศึกษา\nขอรับคำปรึกษาและแนะแนว',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },
                  {
                    text: 'บันทึกการบริการ\nให้คำปรึกษาและแนะแนวอ.ที่ปรึกษา',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },
                  {
                    text: 'กรณีให้คำปรึกษาและแนะแนวไม่ได้',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },
                  {
                    text: 'สรุปผล/วันที่รับเรื่อง\nกลับคืน',
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
        for (var i = 0; i < this.dataAdvice_notNull.length; i++) {
          let a = this.dataAdvice_notNull[i].advice_date.split('-');
          let b = Number(a[0]) + 543;
          let dataaaa2 = [
            {
              text: a[2] + '/' + a[1] + '/' + b,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text:
                this.dataAdvice_notNull[i].titlename +
                this.dataAdvice_notNull[i].fname +
                ' ' +
                this.dataAdvice_notNull[i].lname,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataAdvice_notNull[i].subject_advice,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataAdvice_notNull[i].reply,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: '',
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: '',
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
            {
              text:
                'แบบบันทึกการให้คำปรึกษาและแนะแนวโดยอาจารย์ที่ปรึกษา' +
                ' ' +
                'ปีการศึกษา' +
                ' ' +
                this.advice_year.value._year,
              fontSize: 16,
              alignment: 'center',
              bold: true,
            },
            {
              text:
                'นักศึกษาชั้นปี' +
                ' ' +
                f +
                '  ' +
                'ห้อง' +
                ' ' +
                this.nameGroup +
                '  ' +
                'ระดับ ปริญญาตรี',
              fontSize: 16,
              alignment: 'center',
              bold: true,
            },
            {
              text: g + '  ' + faculty,
              fontSize: 16,
              alignment: 'center',
              bold: true,
            },
            {
              columns: data_st,
              fontSize: 16,
            },
            {
              text: 'หมายเหตุ',
              bold: true,
              alignment: 'left',
              decoration: 'underline',
              fontSize: 14,
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: '1.',
                  bold: true,
                  margin: [10, 0, 10, 0],
                },
                {
                  bold: true,
                  width: 'auto',
                  text: [
                    'เรื่องที่นักศึกษาขอรับคำปรึกษาและแนะแนว',
                    {
                      text:
                        ' ' +
                        'เช่น การให้คำปรึกษาในเรื่องทางวิชาการ  การใช้ชีวิต เช่น การปรับตัว บุคลิกภาพ สุขภาพจิต ด้านอาชีพ การศึกษาต่อ ทุนการศึกษา ฯลฯ อื่นๆ (ระบุ)……………………',
                      bold: false,
                    },
                  ],
                },
              ],
              fontSize: 14,
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: '2.',
                  bold: true,
                  margin: [10, 0, 10, 0],
                },
                {
                  bold: true,
                  width: 'auto',
                  text: [
                    'กรณีให้คำปรึกษาและแนะแนวไม่ได้',
                    {
                      text:
                        ' ' +
                        'เช่น ปัญหาชีวิต ครอบครัว สังคม ที่ต้องใช้จิตวิทยาสูง ให้ระบุหน่วยงานที่ส่งต่อ วัน/เดือน/ปีที่ส่ง',
                      bold: false,
                    },
                  ],
                },
              ],
              fontSize: 14,
            },
          ],
          defaultStyle: {
            font: 'THSarabunNew',
          },
        };
        pdfMake.createPdf(dd).open();
      }
    }
  }
}
