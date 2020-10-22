import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

// import * as fs from 'fs';
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
  public yearNow: any = null;
  public dataGoodness: any = null;
  public dataBranch: any = null;
  public dataGroup_Branch: any = null;
  public codeGroup_Branch: any = null;
  public goodness_year: FormGroup;
  public dataGoodness_BranchHead: any = null;
  public dataBranchhead: any = null;
  public nameGroup: any = null;
  public nameTeacher: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getCURDATE();
    this.getYear();
    this.getBranch();
    this.getBranchhead();
  }

  ngOnInit(): void {
    this.advice_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
    this.goodness_year = this.formBuilder.group({
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

  public clickGroup(i) {
    this.codeGroup = i.study_group_id;
    this.nameGroup = i.study_group_name;
    this.nameTeacher = i.titlename + i.fname + ' ' + i.lname;
    // this.getAdvice();
    // this.getAdvice_notNull();
    this.getGoodnessStudent();
    this.getGoodness();
  }

  public getYearAdvice(e) {
    this.advice_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getGoodness();
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
        this.yearNow = getData.response.result[0].year;
        this.advice_year.patchValue({
          _year: getData.response.result[0].year,
        });
        this.goodness_year.patchValue({
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
    let formData = new FormData();
    if (
      this.formGoodness.value.note == null &&
      this.formGoodness.value.awards == null
    ) {
      this.formGoodness.value.note = '';
      this.formGoodness.value.awards = '';
    } else if (this.formGoodness.value.note == null) {
      this.formGoodness.value.note = '';
    } else if (this.formGoodness.value.awards == null) {
      this.formGoodness.value.awards = '';
    }
    formData.append(
      'detail',
      this.formGoodness.value.type + ' ' + this.formGoodness.value.detail
    );
    formData.append('awards', this.formGoodness.value.awards);
    formData.append('note', this.formGoodness.value.note);
    formData.append('student', this.formGoodness.value.student);
    formData.append('year', this.yearNow);

    let getData: any = await this.http.post('teacher/addGoodness', formData);

    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        let win: any = window;
        win.$('#AddGoddness').modal('hide');
        this.getGoodness();
        this.getGoodness_BranchHead();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public async getGoodness() {
    let formData = new FormData();

    formData.append('group', this.codeGroup);
    formData.append('year', this.advice_year.value._year);
    let getData: any = await this.http.post('teacher/getGoodness', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGoodness = getData.response.result;
      } else {
        this.dataGoodness = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }

  public clickUpdateGoodness(data) {
    this.getGoodnessStudent();
    let a = data.osb_detail.split(' ', 1);
    let b = data.osb_detail.replace(a + ' ', '');
    this.formGoodness = this.formBuilder.group({
      type: [a[0], Validators.required],
      detail: [b, Validators.required],
      awards: [data.osb_award],
      note: [data.osb_note],
      student: [data.osb_student, Validators.required],
      osb_id: [data.osb_id, Validators.required],
    });
  }

  public updateGoodness = async () => {
    let formData = new FormData();
    formData.append(
      'detail',
      this.formGoodness.value.type + ' ' + this.formGoodness.value.detail
    );
    formData.append('awards', this.formGoodness.value.awards);
    formData.append('note', this.formGoodness.value.note);
    formData.append('student', this.formGoodness.value.student);
    formData.append('year', this.yearNow);
    formData.append('ID', this.formGoodness.value.osb_id);

    let getData: any = await this.http.post('teacher/updateGoodness', formData);

    if (getData.connect) {
      if (getData.response.result) {
        this.getGoodness();
        this.getGoodness_BranchHead();
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        let win: any = window;
        win.$('#updateGoodness').modal('hide');
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public deleteGoodness = async (data: any) => {
    let formData = new FormData();
    formData.append('ID', data);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delGoodness',
          formData
        );
        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            this.getGoodness();
            this.getGoodness_BranchHead();
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

  public async clickBranch(i) {
    this.codeGroup_Branch = null;
    let formData = new FormData();
    formData.append('ID', i.code);
    let getData: any = await this.http.post(
      'teacher/getGroup_branch',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGroup_Branch = getData.response.result;
      } else {
        this.dataGroup_Branch = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }
  public getYear_Current(e) {
    this.goodness_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getGoodness_BranchHead();
  }
  public async clickGroup_Branch(i) {
    this.codeGroup_Branch = i.study_group_id;
    this.nameTeacher = i.titlename + i.fname + ' ' + i.lname;
    this.getGoodness_BranchHead();
  }
  public async getGoodness_BranchHead() {
    let formData = new FormData();

    formData.append('group', this.codeGroup_Branch);
    formData.append('year', this.goodness_year.value._year);
    let getData: any = await this.http.post('teacher/getGoodness', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGoodness_BranchHead = getData.response.result;
      } else {
        this.dataGoodness_BranchHead = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }

  public async makePdf() {
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
              widths: [40, '*', 150, 80, 80],
              body: [
                [
                  {
                    text: 'ลำดับที่',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },
                  {
                    text: 'ชื่อ - สกุล',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },

                  {
                    text: 'พฤติกรรมดีเด่น',
                    style: 'tableHeader',
                    alignment: 'center',
                    bold: true,
                  },
                  {
                    text: 'รางวัลที่ได้รับ',
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
        for (var i = 0; i < this.dataGoodness.length; i++) {
          let dataaaa2 = [
            { text: String(i + 1), style: '', alignment: '', bold: false },
            {
              text:
                this.dataGoodness[i].titlename +
                this.dataGoodness[i].fname +
                ' ' +
                this.dataGoodness[i].lname,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataGoodness[i].osb_detail,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataGoodness[i].osb_award,
              style: '',
              alignment: '',
              bold: false,
            },
            {
              text: this.dataGoodness[i].osb_note,
              style: '',
              alignment: '',
              bold: false,
            },
          ];
          data_st[1]['table']['body'].push(dataaaa2);
        }
        // console.log(data_st[1]['table']['body']);
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
                'บันทึกรายงานพฤติกรรมดีเด่นของนักศึกษา' +
                ' ' +
                'ปีการศึกษา' +
                ' ' +
                this.goodness_year.value._year,
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
              columns: [
                {
                  width: 'auto',
                  text: 'คำชี้แจง :',
                  bold: true,
                  margin: [0, 0, 4, 0],
                  decoration: 'underline',
                },
                {
                  width: 'auto',
                  text:
                    ' ' +
                    'บันทึกรายงานฉบับนี้ใช้สำรวจนักศึกษาที่ดีเด่นด้านต่างๆ เพื่อให้ท่านสำรวจพฤติกรรมของนักศึกษา โดยระบุให้ชัดเจน\nในช่องพฤติกรรมว่าดีเด่นด้านใด ดังนี้',
                },
              ],
              fontSize: 12,
              margin: [50, 10, 0, 0],
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: '1.ด้านการเรียนดีเด่น',
                  bold: true,
                  margin: [0, 0, 80, 0],
                },
                {
                  width: 'auto',
                  text:
                    ' ' +
                    'แต่ละปีการศึกษามีผลการเรียนในระดับ 3.5 ขึ้นไป และสอบผ่านทุกรายวิชาหรือ    การได้รับทุนการศึกษาจากบริษัท หน่วยงาน ชมรมฯลฯ ซึ่งพิจารณาจากผลการเรียนการได้รับโควตาให้เรียนต่อเป็นกรณีพิเศษ',
                },
              ],
              fontSize: 12,
              margin: [80, 10, 0, 0],
            },

            {
              columns: [
                {
                  width: 'auto',
                  text: '2.ด้านกิจกรรมดีเด่น',
                  bold: true,
                  margin: [0, 0, 80, 0],
                },
                {
                  width: 'auto',
                  text:
                    ' ' +
                    'เคยได้รับรางวัลจากการแข่งขันทักษะทางวิชาชีพ การประกวดสุนทรพจน์ การโต้วาที การตอบปัญหา การเล่นกีฬา ฯลฯ',
                },
              ],
              fontSize: 12,
              margin: [80, 10, 0, 0],
            },
            {
              columns: [
                {
                  width: 'auto',
                  text: '3.ด้านคุณธรรมจริยธรรมดีเด่น',
                  bold: true,
                  margin: [0, 0, 48, 0],
                },
                {
                  width: 'auto',
                  text:
                    ' ' +
                    'เป็นผู้ที่มีพฤติกรรมแสดงออกถึงความซื่อสัตย์อดทน ขยันหมั่นเพียร เอื้อเฟื้อเผื่อแผ่ โอบอ้อมอารี เช่น เก็บของได้และนำส่งคืนเจ้าของสมควรได้รับการเชิดชูเกียรติ ฯลฯ',
                },
              ],
              fontSize: 12,
              margin: [80, 10, 0, 0],
            },
            {
              columns: [
                {
                  width: 145,
                  text: '4.ด้านบำเพ็ญประโยชน์เพื่อสังคม',
                  bold: true,
                },
                {
                  width: '*',
                  text:
                    'เป็นผู้ที่มีความเสียสละต่อส่วนรวม เป็นผู้นำกลุ่มมีความคิดริเริ่มในการทำ\nกิจกรรมรับผิดชอบ มีมนุษยสัมพันธ์ดี เช่น การบริจาคโลหิต เป็นประธานชมรม ฯลฯ',
                },
              ],
              fontSize: 12,
              margin: [80, 10, 0, 0],
            },
          ],
          defaultStyle: {
            font: 'THSarabunNew',
          },
        };
        pdfMake.createPdf(dd).open();
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
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

  public async createDOC() {
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
                        text: 'ลำดับที่',
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
                        text: 'ชื่อ - สกุล',
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
                        text: 'พฤติกรรมดีเด่น',
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
                        text: 'รางวัลที่ได้รับ',
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
        for (var i = 0; i < this.dataGoodness.length; i++) {
          var aw = null;
          var no = null;
          if (this.dataGoodness[i].osb_award == null) {
            aw = ' ';
          } else {
            aw = this.dataGoodness[i].osb_award;
          }
          if (this.dataGoodness[i].osb_note == null) {
            no = ' ';
          } else {
            no = this.dataGoodness[i].osb_note;
          }
          dataG = new TableRow({
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
                width: { size: 5, type: WidthType.PERCENTAGE },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        font: 'TH SarabunPSK',
                        text:
                          this.dataGoodness[i].titlename +
                          this.dataGoodness[i].fname +
                          ' ' +
                          this.dataGoodness[i].lname,
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
                        text: this.dataGoodness[i].osb_detail,
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
                        text: aw,
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
                        text: no,
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
                    'บันทึกรายงานพฤติกรรมดีเด่นของนักศึกษา ปีการศึกษา ' +
                    this.goodness_year.value._year +
                    '\n',
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
                  text: '',
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
                  text: 'คำชี้แจง:',
                  bold: true,
                  underline: { color: 'black' },
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    ' บันทึกรายงานฉบับนี้ใช้สำรวจนักศึกษาที่ดีเด่นด้านต่างๆ เพื่อให้ท่านสำรวจพฤติกรรมของนักศึกษา โดยระบุให้ชัดเจน ในช่องพฤติกรรมว่าดีเด่นด้านใด ดังนี้',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: '1.ด้านการเรียนดีเด่น',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    '  แต่ละปีการศึกษามีผลการเรียนในระดับ 3.5 ขึ้นไป และสอบผ่านทุกรายวิชาหรือ การได้รับทุนการศึกษาจากบริษัท หน่วยงาน ชมรมฯลฯ ซึ่งพิจารณาจากผลการเรียนการได้รับโควตาให้เรียนต่อเป็นกรณีพิเศษ',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: '2.ด้านกิจกรรมดีเด่น',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    '  เคยได้รับรางวัลจากการแข่งขันทักษะทางวิชาชีพ การประกวดสุนทรพจน์ การโต้วาที การตอบปัญหา การเล่นกีฬา ฯลฯ',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: '3.ด้านคุณธรรมจริยธรรมดีเด่น',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    '  เป็นผู้ที่มีพฤติกรรมแสดงออกถึงความซื่อสัตย์อดทน ขยันหมั่นเพียร เอื้อเฟื้อเผื่อแผ่ โอบอ้อมอารี เช่น เก็บของได้และนำส่งคืนเจ้าของสมควรได้รับการเชิดชูเกียรติ ฯลฯ',
                  size: 24,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  font: 'TH SarabunPSK',
                  text: '4.ด้านบำเพ็ญประโยชน์เพื่อสังคม',
                  bold: true,
                  size: 24,
                }),
                new TextRun({
                  font: 'TH SarabunPSK',
                  text:
                    '  เป็นผู้ที่มีความเสียสละต่อส่วนรวม เป็นผู้นำกลุ่มมีความคิดริเริ่มในการทำ กิจกรรมรับผิดชอบ มีมนุษยสัมพันธ์ดี เช่น การบริจาคโลหิต เป็นประธานชมรม ฯลฯ',
                  size: 24,
                }),
              ],
            }),
          ],
        });

        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, `Goodness_${this.nameGroup}.docx`);
        });
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }
}
