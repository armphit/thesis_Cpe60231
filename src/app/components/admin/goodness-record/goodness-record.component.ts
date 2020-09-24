import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  public goodness_year: FormGroup;
  public range: Array<any> = [];
  public dataGoodness: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
    this.getYear();
    this.getCURDATE();
  }

  ngOnInit(): void {
    this.goodness_year = this.formBuilder.group({
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
    this.getGoodness();
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
  public getYearGoodness(e) {
    this.goodness_year = this.formBuilder.group({
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
        this.goodness_year.patchValue({
          _year: getData.response.result[0].year,
        });
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public async getGoodness() {
    let formData = new FormData();

    formData.append('group', this.groupID);
    formData.append('year', this.goodness_year.value._year);
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
  public async makePdf() {
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
        let a = this.groupName.split('.', 1);
        let b = this.groupName.replace(a + '.', '');
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
                    text: 'ชื่อ -สกุล',
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
            {
              text: String(i + 1),
              style: '',
              alignment: 'center',
              bold: false,
            },
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
                this.groupName +
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
        let a = this.groupName.split('.', 1);
        let b = this.groupName.replace(a + '.', '');
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
                    children: [new TextRun({ text: `${i + 1}`, size: 32 })],
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
                    children: [new TextRun({ text: aw, size: 32 })],
                  }),
                ],
              }),

              new TableCell({
                children: [
                  new Paragraph({
                    children: [new TextRun({ text: no, size: 32 })],
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
                    this.groupName +
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
          saveAs(blob, `Goodness_${this.groupName}.docx`);
        });
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }
}
