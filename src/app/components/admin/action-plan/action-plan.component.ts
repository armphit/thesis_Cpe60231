import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  selector: 'app-action-plan',
  templateUrl: './action-plan.component.html',
  styleUrls: ['./action-plan.component.scss'],
})
export class ActionPlanComponent implements OnInit {
  public Plan_month: any = null;
  public thmonth = new Array(
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.'
  );
  public actionPlan_year: FormGroup;
  public dataPlan_month: any = null;
  public month: Array<any> = [];
  public month2: Array<any> = [];
  public range: Array<any> = [];
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
  public dataActionPlan_Status: any = null;
  public dataActionPlan_Completed: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getCURDATE();
    this.getYear();
    this.getFaculty();
  }

  ngOnInit(): void {
    this.actionPlan_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
  }
  public getMonthactionPlan(e) {
    this.Plan_month = e;
  }
  public addPlan_month = async () => {
    let formData = new FormData();
    formData.append('month', this.Plan_month);
    formData.append('year', this.actionPlan_year.value._year);

    let getData: any = await this.http.post('teacher/addMonth', formData);
    console.log(getData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        Swal.fire('เพิ่มเดือนเริ่มต้นสำเร็จ', '', 'success');
        this.month_plan();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่ได้', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public month_plan = async () => {
    let formData = new FormData();
    formData.append('year', this.actionPlan_year.value._year);

    let getData: any = await this.http.post('teacher/PlanMonth', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataPlan_month = getData.response.result[0].month;
        if (this.dataPlan_month != null) {
          var a = this.thmonth.indexOf(this.dataPlan_month);
          const b = this.thmonth;
          const c = this.thmonth;
          var d = this.actionPlan_year.value._year;
          var f = String(d.substring(2));
          var g = String(Number(d.substring(2)) + 1);

          for (var i = a; i < this.thmonth.length; i++) {
            this.month[i - a] = b[i] + f;
          }
          for (var i = 0; i < a; i++) {
            this.month2[i] = c[i] + g;
          }
        }
      } else {
        this.dataPlan_month = null;
        this.month = [];
        this.month2 = [];
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public delMonth = async () => {
    let formData = new FormData();
    formData.append('year', this.actionPlan_year.value._year);

    this.http
      .confirmAlert('แน่ใจจะเปลี่ยนแปลงหรือไม่?')
      .then(async (value: any) => {
        if (value) {
          let getData: any = await this.http.post('teacher/delMonth', formData);

          if (getData.connect) {
            if (getData.response.rowCount > 0) {
              Swal.fire({
                position: 'top',
                icon: 'success',
                title: 'ลบข้อมูลสำเร็จ',
                showConfirmButton: false,
                timer: 1500,
              });
              this.month = [];
              this.month2 = [];
              this.month_plan();
            } else {
              Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
            }
          }
        }
      });
  };
  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.actionPlan_year.patchValue({
          _year: getData.response.result[0].year,
        });
        this.month_plan();
      } else {
        alert('ไม่มีปีการศึกษา');
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };
  public getYearactionPlan(e) {
    this.actionPlan_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.month_plan();
    // this.getListPlan();
    // this.getActionPlan_Status();
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
    // this.getGoodness();
    this.getActionPlan_Status();
    this.getActionPlan_Completed();
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
  public getActionPlan_Status = async () => {
    let formData = new FormData();
    formData.append('group', this.groupID);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post(
      'teacher/getActionPlan_Status',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_Status = getData.response.result;
      } else {
        this.dataActionPlan_Status = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getActionPlan_Completed = async () => {
    let formData = new FormData();
    formData.append('group', this.groupID);
    formData.append('year', this.actionPlan_year.value._year);
    let getData: any = await this.http.post(
      'teacher/getActionPlan_Completed',
      formData
    );

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataActionPlan_Completed = getData.response.result;
      } else {
        this.dataActionPlan_Completed = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  public getValue(data: any) {
    if (data == 'true') {
      data = '/';
    } else {
      data = '';
    }

    return data;
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
  public exportPDF = async () => {
    var month = this.month.concat(this.month2);

    let data_plan = [
      { width: '*', text: '' },
      {
        width: 'auto',
        table: {
          headerRows: 1,
          widths: [
            20,
            90,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            20,
            25,
          ],
          body: [
            [
              {
                text: 'ลำ\nดับ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: 'รายการ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },

              {
                text: 'ช่วงเวลา',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[0],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[1],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[2],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[3],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[4],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[5],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[6],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[7],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[8],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[9],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[10],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
              {
                text: month[11],
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },

              {
                text: 'หมาย\nเหตุ',
                style: 'tableHeader',
                alignment: 'center',
                bold: true,
              },
            ],
          ],
          alignment: 'left',
        },
      },
      { width: '*', text: '' },
    ];
    var action = {
      m1: null,
      m2: null,
      m3: null,
      m4: null,
      m5: null,
      m6: null,
      m7: null,
      m8: null,
      m9: null,
      m10: null,
      m11: null,
      m12: null,
    };

    for (var i = 0; i < this.dataActionPlan_Completed.length; i++) {
      if (this.dataActionPlan_Completed[i].apa_m1 == 'true') {
        action.m1 = '/';
      } else {
        action.m1 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m2 == 'true') {
        action.m2 = '/';
      } else {
        action.m2 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m3 == 'true') {
        action.m3 = '/';
      } else {
        action.m3 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m4 == 'true') {
        action.m4 = '/';
      } else {
        action.m4 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m5 == 'true') {
        action.m5 = '/';
      } else {
        action.m5 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m6 == 'true') {
        action.m6 = '/';
      } else {
        action.m6 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m7 == 'true') {
        action.m7 = '/';
      } else {
        action.m7 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m8 == 'true') {
        action.m8 = '/';
      } else {
        action.m8 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m9 == 'true') {
        action.m9 = '/';
      } else {
        action.m9 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m10 == 'true') {
        action.m10 = '/';
      } else {
        action.m10 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m11 == 'true') {
        action.m11 = '/';
      } else {
        action.m11 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m12 == 'true') {
        action.m12 = '/';
      } else {
        action.m12 = '';
      }

      let data_plan2 = [
        {
          rowSpan: 2,
          text: String((i + 1) / 2 + 0.5),
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          rowSpan: 2,
          text: this.dataActionPlan_Completed[i].action_plan_list,
          style: '',
          alignment: '',
          bold: false,
        },
        {
          text: this.dataActionPlan_Completed[i].apa_distance,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m1,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m2,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m3,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m4,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m5,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m6,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m7,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m8,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m9,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m10,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m11,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: action.m12,
          style: '',
          alignment: 'center',
          bold: false,
        },
        {
          text: this.dataActionPlan_Completed[i].note,
          style: '',
          alignment: '',
          bold: false,
        },
      ];
      data_plan[1]['table']['body'].push(data_plan2);
    }

    const dd = {
      header: {},
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
            'แผนปฏิบัติงานการบริการให้คำปรึกษาและแนะแนว ของอาจารย์ที่ปรึกษา' +
            ' ' +
            'ปีการศึกษา' +
            ' ' +
            this.actionPlan_year.value._year,
          fontSize: 16,
          alignment: 'center',
          bold: true,
        },
        {
          columns: data_plan,
          fontSize: 14,
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
          text: 'ผู้จัดทำแผนปฏิบัติงาน',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'วันที่................................................',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text:
            '\nลงชื่อ.................................................................\n( ' +
            this.nameBranchhead +
            ' )',
          fontSize: 16,
          alignment: 'right',
        },

        {
          text: 'หัวหน้าโปรแกรมวิชา/สาขาวิชา ผู้อนุมัติ',
          fontSize: 16,
          alignment: 'right',
        },
        {
          text: 'วันที่................................................',
          fontSize: 16,
          alignment: 'right',
        },
      ],

      defaultStyle: {
        font: 'THSarabunNew',
      },
    };

    pdfMake.createPdf(dd).open();
  };
  public createDOC() {
    var month = this.month.concat(this.month2);

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
                  new TextRun({ text: 'ลำ\nดับ', bold: true, size: 32 }),
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
                    text: 'รายการ',
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
                    text: 'ช่วงเวลา',
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
                    text: month[0],
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
                  new TextRun({ text: month[1], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[2], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[3], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[4], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[5], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[6], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[7], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[8], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[9], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[10], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: month[11], bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: 'หมาย\nเหตุ', bold: true, size: 32 }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        ],
        tableHeader: true,
      }),
    ];
    var action = {
      m1: null,
      m2: null,
      m3: null,
      m4: null,
      m5: null,
      m6: null,
      m7: null,
      m8: null,
      m9: null,
      m10: null,
      m11: null,
      m12: null,
    };
    for (var i = 0; i < this.dataActionPlan_Completed.length; i++) {
      if (this.dataActionPlan_Completed[i].apa_m1 == 'true') {
        action.m1 = '/';
      } else {
        action.m1 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m2 == 'true') {
        action.m2 = '/';
      } else {
        action.m2 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m3 == 'true') {
        action.m3 = '/';
      } else {
        action.m3 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m4 == 'true') {
        action.m4 = '/';
      } else {
        action.m4 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m5 == 'true') {
        action.m5 = '/';
      } else {
        action.m5 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m6 == 'true') {
        action.m6 = '/';
      } else {
        action.m6 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m7 == 'true') {
        action.m7 = '/';
      } else {
        action.m7 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m8 == 'true') {
        action.m8 = '/';
      } else {
        action.m8 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m9 == 'true') {
        action.m9 = '/';
      } else {
        action.m9 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m10 == 'true') {
        action.m10 = '/';
      } else {
        action.m10 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m11 == 'true') {
        action.m11 = '/';
      } else {
        action.m11 = '';
      }
      if (this.dataActionPlan_Completed[i].apa_m12 == 'true') {
        action.m12 = '/';
      } else {
        action.m12 = '';
      }
      dataG = new TableRow({
        children: [
          new TableCell({
            rowSpan: 2,
            children: [
              new Paragraph({
                children: [new TextRun({ text: `${i + 1}`, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
            width: { size: 5, type: WidthType.PERCENTAGE },
          }),
          new TableCell({
            rowSpan: 2,
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: this.dataActionPlan_Completed[i].action_plan_list,
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
                    text: this.dataActionPlan_Completed[i].apa_distance,
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
                children: [new TextRun({ text: action.m1, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),

          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m2, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m3, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m4, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m5, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m6, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m7, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m8, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m9, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m10, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m11, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: action.m12, size: 32 })],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: this.dataActionPlan_Completed[i].note,
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
              text:
                'แผนปฏิบัติงานการบริการให้คำปรึกษาและแนะแนว ของอาจารย์ที่ปรึกษา' +
                ' ' +
                'ปีการศึกษา' +
                ' ' +
                this.actionPlan_year.value._year,
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
              text: '',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text:
                'ลงชื่อ.................................................................',

              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '( ' + this.groupUser_name + ' )',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'ผู้จัดทำแผนปฏิบัติงาน',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'วันที่................................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '',
              bold: true,
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text:
                'ลงชื่อ.................................................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '( ' + this.nameBranchhead + ' )',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'หัวหน้าโปรแกรมวิชา/สาขาวิชา ผู้อนุมัติ',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: 'วันที่................................................',
              size: 32,
            }),
          ],
          alignment: AlignmentType.RIGHT,
        }),
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Plan_${this.groupName}.docx`);
    });
  }
}
