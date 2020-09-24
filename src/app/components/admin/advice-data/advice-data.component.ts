import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
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

  public dataAppointment_Student: any = null;

  public dataReply_id = {
    subject_advice: null,
    detail: null,
    reply: null,
    reply_id: null,
    advice_advisor: null,
    reply_advice_file: null,
    nameStudent: null,
    faculty: null,
    brunch: null,
  };

  public range: Array<any> = [];
  public advice_year: FormGroup;
  public nameGroup: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
    this.getCURDATE();
    this.getYear();
  }

  ngOnInit(): void {
    this.advice_year = this.formBuilder.group({
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
    this.dataReply_id.faculty = nameFaculty;
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
    this.groupID = null;
    this.acronym = acronym;
    this.codeBranch = codeBranch;
    this.dataReply_id.brunch = name;
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
    this.nameGroup = namegroup;
    this.groupUser_name = titlename + fname + ' ' + lname;
    this.getAdvice();
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
    formData.append('group', this.groupID);
    formData.append('year', this.advice_year.value._year);
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

  // public getStudent = async () => {
  //   let formData = new FormData();
  //   formData.append('group', this.groupID);
  //   let getData: any = await this.http.post('admin/getStudent', formData);
  //   if (getData.connect) {
  //     if (getData.response.rowCount > 0) {
  //       this.dataStudent = getData.response.result;
  //     } else {
  //       this.dataStudent = null;
  //     }
  //   } else {
  //     alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
  //   }
  // };

  clickReply_data(dataReply: any) {
    this.dataReply_id.subject_advice = dataReply.subject_advice;
    this.dataReply_id.detail = dataReply.detail;
    this.dataReply_id.reply = dataReply.reply;
    this.dataReply_id.reply_id = dataReply.reply_advice_id;
    this.dataReply_id.advice_advisor = dataReply.advice_advisor;
    this.dataReply_id.reply_advice_file = dataReply.reply_advice_file;
    this.dataReply_id.nameStudent =
      dataReply.titlename + dataReply.fname + ' ' + dataReply.lname;
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
  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };
  public getYearAdvice(e) {
    this.advice_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getAdvice();
  }
  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.advice_year.patchValue({
          _year: getData.response.result[0].year,
        });
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public async clickPDF_st() {
    var date = new Date();
    let a = this.nameGroup.split('.', 1);
    let b = this.nameGroup.replace(a + '.', '');
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
          text: 'ประจำปีการศึกษา ' + this.advice_year.value._year,
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
            this.groupUser_name +
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
    formData.append('ID', this.groupID);
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
        for (var i = 0; i < this.dataAdvice.length; i++) {
          let a = this.dataAdvice[i].advice_date.split('-');
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
                this.dataAdvice[i].titlename +
                this.dataAdvice[i].fname +
                ' ' +
                this.dataAdvice[i].lname,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataAdvice[i].subject_advice,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataAdvice[i].reply,
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
  public docxGroup = async () => {
    let formData = new FormData();
    formData.append('ID', this.groupID);
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
        var dataG = null;

        var dataRow = [
          new TableRow({
            children: [
              new TableCell({
                // width: {
                //   size: 1,
                //   type: WidthType.PERCENTAGE,
                // },
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: 'TH SarabunPSK',
                        text: 'วัน เดือน ปี',
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
                        text: 'ชื่อ-สกุล นักศึกษา',
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
                        text: 'เรื่องที่นักศึกษา ขอรับคำปรึกษาและแนะแนว',
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
                        text:
                          'บันทึกการบริการ ให้คำปรึกษาและแนะแนว อ.ที่ปรึกษา',
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
                        text: 'กรณีให้คำปรึกษาและแนะแนวไม่ได้',
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
                        text: 'สรุปผล/วันที่รับเรื่องกลับคืน',
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
        for (var i = 0; i < this.dataAdvice.length; i++) {
          let a = this.dataAdvice[i].advice_date.split('-');
          let b = Number(a[0]) + 543;
          dataG = new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: 'TH SarabunPSK',
                        text: a[2] + '/' + a[1] + '/' + b,
                        size: 32,
                      }),
                    ],
                    alignment: AlignmentType.CENTER,
                  }),
                ],
                width: { size: 5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: 'TH SarabunPSK',
                        text:
                          this.dataAdvice[i].titlename +
                          this.dataAdvice[i].fname +
                          ' ' +
                          this.dataAdvice[i].lname,
                        size: 32,
                      }),
                    ],
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: 'TH SarabunPSK',
                        text: this.dataAdvice[i].subject_advice,
                        size: 32,
                      }),
                    ],
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: 'TH SarabunPSK',
                        text: this.dataAdvice[i].reply,
                        size: 32,
                      }),
                    ],
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: ' ', size: 32 })],
                  }),
                ],
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: ' ', size: 32 })],
                  }),
                ],
              }),
            ],
          });
          dataRow.push(dataG);
        }
        // const documentCreator = new DocumentCreator();
        const doc = new Document();
        doc.addSection({
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    'แบบบันทึกการให้คำปรึกษาและแนะแนวโดยอาจารย์ที่ปรึกษา' +
                    ' ' +
                    'ปีการศึกษา' +
                    ' ' +
                    this.advice_year.value._year,
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
                  text: g + '  ' + faculty,
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
              rows: dataRow,

              alignment: AlignmentType.CENTER,
            }),

            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: 'หมายเหตุ:',
                  bold: true,
                  underline: { color: 'black' },
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: '1. เรื่องที่นักศึกษาขอรับคำปรึกษาและแนะแนว',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    '  เช่น การให้คำปรึกษาในเรื่องทางวิชาการ  การใช้ชีวิต เช่น การปรับตัว บุคลิกภาพ สุขภาพจิต ด้านอาชีพ การศึกษาต่อ ทุนการศึกษา ฯลฯ อื่นๆ (ระบุ)……………………',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: '2.กรณีให้คำปรึกษาและแนะแนวไม่ได้',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    '  เช่น ปัญหาชีวิต ครอบครัว สังคม ที่ต้องใช้จิตวิทยาสูง ให้ระบุหน่วยงานที่ส่งต่อ วัน/เดือน/ปีที่ส่ง',
                  size: 24,
                }),
              ],
            }),
          ],
        });

        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, `Advice_${this.nameGroup}.docx`);
        });
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public docxStudent = async () => {
    var date = new Date();
    let a = this.nameGroup.split('.', 1);
    let b = this.nameGroup.replace(a + '.', '');
    let c = String(date.getFullYear() + 543);
    let d = c.substring(2);
    let e = b.substring(0, 2);
    let f = Number(d) - Number(e) + 1;
    let g = null;
    let h = null;
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
      var dataG = null;

      var dataRow = [
        new TableRow({
          children: [
            new TableCell({
              width: {
                size: 50,
                type: WidthType.PERCENTAGE,
              },

              children: [
                new Paragraph({
                  pageBreakBefore: true,
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: 'ว/ด/ป',
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
                      text: 'ผลที่เกิด/คำแนะนำเพิ่มเติม',
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
                      text: 'หมายเหตุ',
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
        dataG = new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: date,
                      size: 32,
                    }),
                  ],
                }),
              ],
              width: { size: 5, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataAppointment_Student[i].app_suggestion,
                      size: 32,
                    }),
                  ],
                }),
              ],
            }),

            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      font: 'TH SarabunPSK',
                      text: this.dataAppointment_Student[i].app_detail,
                      size: 32,
                    }),
                  ],
                }),
              ],
            }),
          ],
        });
        dataRow.push(dataG);
      }
      h = 'มีนัดพบติดตามผลดังตาราง';
      j =
        '\n*** เก็บไว้ที่งานแนะแนวการศึกษาและอาชีพ กองพัฒนานักศึกษา/อาจารย์ที่ปรึกษา/แผนกงานพัฒนานักศึกษา คณะฯ';
      data_aap = new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: dataRow,

        alignment: AlignmentType.CENTER,
      });
    } else if (this.dataAppointment_Student == null) {
      h = 'ไม่มีนัดพบติดตามผล';
      j = '';
      data_aap = new Paragraph({
        children: [
          new TextRun({
            font: 'TH SarabunPSK',
            text: '',
            bold: true,
            size: 32,
          }),
        ],
        alignment: AlignmentType.LEFT,
      });
    }

    // const documentCreator = new DocumentCreator();
    const doc = new Document();
    doc.addSection({
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'แบบบันทึกการบริการให้คำปรึกษาและแนะแนวมหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน' +
                ' ' +
                'ประจำปีการศึกษา' +
                ' ' +
                this.advice_year.value._year,
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
              text: 'ที่ มทร. อีสาน',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                '.........................................................................................................................................................',
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
              text: 'ข้อมูลนักศึกษา',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ชื่อ – สกุล' + '  ' + this.dataReply_id.nameStudent,

              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'นักศึกษา' +
                this.dataReply_id.faculty +
                '  ' +
                this.dataReply_id.brunch,

              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ชั้นปีที่' + ' ' + f + '  ' + 'รอบ' + ' ' + g,

              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text:
                'ขอรับการให้คำปรึกษาแนะแนวในเรื่อง (สรุปปัญหาโดยย่อ)' +
                ' ' +
                this.dataReply_id.detail,

              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({ font: 'TH SarabunPSK', text: '', size: 32 }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ลงชื่อ....................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: '( ' + this.dataReply_id.nameStudent + ' )',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({ font: 'TH SarabunPSK', text: '', size: 32 }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'บันทึกของอาจารย์ที่ปรึกษา/ผู้ให้คำปรึกษา',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: this.dataReply_id.reply,
              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [
            new TextRun({ font: 'TH SarabunPSK', text: '', size: 32 }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ลงชื่อ....................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: '(' + this.groupUser_name + ' )',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'อาจารย์ที่ปรึกษา/ผู้ให้คำปรึกษา',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({ font: 'TH SarabunPSK', text: '', size: 32 }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              font: 'TH SarabunPSK',
              text: 'ติดตามผล',
              underline: { color: 'black' },
              size: 32,
            }),
          ],
          alignment: AlignmentType.LEFT,
        }),
        new Paragraph({
          children: [new TextRun({ font: 'TH SarabunPSK', text: h, size: 32 })],
          alignment: AlignmentType.LEFT,
        }),
        data_aap,
        new Paragraph({
          children: [new TextRun({ font: 'TH SarabunPSK', text: j, size: 32 })],
          alignment: AlignmentType.LEFT,
        }),
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Advice_${this.dataReply_id.nameStudent}.docx`);
    });
  };
}
