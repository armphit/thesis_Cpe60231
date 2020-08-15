import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
// import * as fs from 'fs';
// import { Document, Packer, Paragraph, TextRun } from 'docx';
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
  private yearNow: any = null;
  public dataGoodness: any = null;
  public dataBranch: any = null;
  public dataGroup_Branch: any = null;
  public codeGroup_Branch: any = null;
  public goodness_year: FormGroup;
  public dataGoodness_BranchHead: any = null;
  public dataBranchhead: any = null;

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
  public clickGroup(codeGroup) {
    this.codeGroup = codeGroup;
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
  public async clickGroup_Branch(codeGroup) {
    this.codeGroup_Branch = codeGroup;
    this.getGoodness_BranchHead();
  }
  public async getGoodness_BranchHead() {
    console.log(this.goodness_year.value._year);
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

  public makePdf() {
    const dd = {
      header: {},
      footer(currentPage, pageCount) {
        return {
          columns: [
            { text: 'ท้ายกระดาษ', fontSize: 15, alignment: 'center' },
            {
              text:
                'หน้าที่ ' +
                currentPage.toString() +
                ' จาก ' +
                pageCount +
                ' หน้า',
              margin: [5, 5, 15, 5],
              alignment: 'right',
            },
          ],
        };
      },
      content: [
        {
          text: 'ปีการศึกษา' + ' ' + this.goodness_year.value._year,
          fontSize: 18,
          alignment: 'left',
          padding: 1000,
        },
      ],
      defaultStyle: {
        font: 'THSarabunNew',
      },
    };
    pdfMake.createPdf(dd).open();
  }

  // public createDOC() {
  //   const doc = new Document();

  //   // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
  //   // This simple example will only contain one section
  //   doc.addSection({
  //     properties: {},
  //     children: [
  //       new Paragraph({
  //         children: [
  //           new TextRun('Hello World'),
  //           new TextRun({
  //             text: 'Foo Bar',
  //             bold: true,
  //           }),
  //           new TextRun({
  //             text: '\tGithub is the best',
  //             bold: true,
  //           }),
  //         ],
  //       }),

  //       new Paragraph({
  //         children: [new TextRun('แมร่งยากเกิ๊นใครจะทำได้ว่ะ')],
  //       }),
  //     ],
  //   });

  //   // Used to export the file into a .docx file
  //   Packer.toBuffer(doc).then((buffer) => {
  //     fs.writeFileSync('My Document.docx', buffer);
  //   });
  // }
}
