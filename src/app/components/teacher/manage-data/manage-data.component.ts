import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

@Component({
  selector: 'app-manage-data',
  templateUrl: './manage-data.component.html',
  styleUrls: ['./manage-data.component.scss'],
})
export class ManageDataComponent implements OnInit {
  public dataAdvisor: any = null;
  public dataGroup: any = null;
  public dataBranchhead: any = null;
  public dataBranch: any = null;
  public acronym: any = null;
  public codeBranch: any = null;
  public formGroup: FormGroup;
  public dataCurriculum: any = null;
  public formCurriculum: FormGroup;
  public groupID: any = null;
  public dataBranchEdit: any = null;
  public acronymEdit: any = null;
  public updateFile: any = null;
  public updateFile_name: any = 'โปรดเลือกไฟล์';
  public codeGroup: any = null;
  public data: any = null;
  public dataStudent: any = null;
  public range: Array<any> = [];
  term: any = null;
  selected: any = null;
  public formYearTerm: FormGroup;
  public dataEducational: any = null;
  public dataGroup_branchHead: any = null;
  public date_student: FormGroup;
  public year_study: Array<any> = [];
  public date_year: FormGroup;
  public dataCalendar: any = null;
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
  public fileStudentName: any = 'โปรดเลือกไฟล์';
  public upload_curriculum: File = null;
  public upload_curriculum_name: any = 'โปรดเลือกไฟล์';
  public pageStudent: number = 1;
  public codeGroup_Branch: any = null;
  public dataGroup_Branch: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getAdvisor();
    this.getBranchhead();
    this.getCURDATE();
    // this.getGroup_branchHead();
    this.getBranch();
  }

  ngOnInit(): void {
    this.getYear();
    this.formGroup = this.formBuilder.group({
      group: ['', Validators.required],
      brunch: ['', Validators.required],
    });

    this.formCurriculum = this.formBuilder.group({
      groupEdit: ['', Validators.required],
      brunchEdit: ['', Validators.required],
    });

    this.formYearTerm = this.formBuilder.group({
      year: ['', Validators.required],
      term: ['', Validators.required],
    });
    this.date_student = this.formBuilder.group({
      start: ['', Validators.required],
      end: ['', Validators.required],
      selected_year: ['', Validators.required],
      selected_term: ['', Validators.required],
    });

    this.date_year = this.formBuilder.group({
      _year: [``, Validators.required],
    });
  }

  public getAdvisor = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('teacher/getAdvisor', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvisor = getData.response.result;
        this.acronymEdit = getData.response.result[0].acronym;
      } else {
        this.dataAdvisor = null;
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

  public async clickBranch_Branchhead(i) {
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

  public deleteGroup = async (group_id: any) => {
    let formData = new FormData();
    formData.append('code', group_id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('admin/delGroup', formData);

        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getGroup();
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

  public clickBranch(codeBranch, name, acronym) {
    this.acronym = acronym;
    this.formGroup.value.brunch = codeBranch;
  }

  uploadCurriculum(file) {
    if (file) {
      this.upload_curriculum = file;
      this.upload_curriculum_name = file.name;
    }
  }

  public insertGroup = async () => {
    let formData = new FormData();
    var input = this.formGroup.value.group.trim();
    formData.append('group_name', this.acronym + '.' + input.toUpperCase());
    formData.append('upload', this.upload_curriculum);
    formData.append('branch', this.formGroup.value.brunch);
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);

    // formData.append('ID', this.inGroup.value.getTC);
    if (this.upload_curriculum == null) {
      Swal.fire('ไม่สามารถเพิ่มกลุ่มเรียนได้', 'โปรดเลือกไฟล์', 'error');
    } else {
      let getData: any = await this.http.post('teacher/addGroup', formData);

      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('เพิ่มกลุ่มเรียนเสร็จสิ้น', '', 'success');
          this.upload_curriculum = null;
          this.upload_curriculum_name = 'โปรดเลือกไฟล์';
          let win: any = window;
          win.$('#addGroup').modal('hide');
          this.getGroup();
        } else {
          Swal.fire('ไม่สามารถเพิ่มกลุ่มเรียนได้', 'กลุ่มเรียนซ้ำ', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };
  public clearFrom() {
    this.upload_curriculum = null;
    this.upload_curriculum_name = 'โปรดเลือกไฟล์';
    this.formGroup.reset();
  }

  public clickUpdateGroup(study_group_id, study_group_name, branch_id) {
    let a = study_group_name.split('.', 1);
    let b = study_group_name.replace(a + '.', '');

    this.groupID = study_group_id;
    this.formCurriculum = this.formBuilder.group({
      groupEdit: [b, Validators.required],
      brunchEdit: [branch_id, Validators.required],
    });
    this.getBranchEdit();
    this.updateFile = null;
    this.updateFile_name = 'โปรดเลือกไฟล์';
  }

  public getBranchEdit = async () => {
    let formData = new FormData();
    formData.append(
      'code',
      JSON.parse(localStorage.getItem('userLogin')).branch
    );
    let getData: any = await this.http.post('admin/getBranch', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranchEdit = getData.response.result;
      } else {
        this.dataBranchEdit = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
  updateCurriculum(file) {
    if (file) {
      this.updateFile = file;
      this.updateFile_name = file.name;
    }
  }

  public clickBranchEdit(codeBranch) {
    this.formCurriculum.value.brunchEdit = codeBranch;
  }

  async clickUploadCurriculum() {
    let formData = new FormData();
    var input = this.formCurriculum.value.groupEdit.trim();
    formData.append('group', this.groupID);
    formData.append('upload', this.updateFile);
    formData.append('group_name', this.acronymEdit + '.' + input.toUpperCase());
    formData.append('branch_id', this.formCurriculum.value.brunchEdit);
    let getData: any = await this.http.post(
      'teacher/addUploadCurriculum',
      formData
    );

    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
        let win: any = window;
        win.$('#updateGroup').modal('hide');
        this.getGroup();
      } else {
        Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  }

  public clickGroup(codeGroup) {
    this.codeGroup = codeGroup;
    // this.getStudent();
    this.getEducational();
  }

  async uploadFileStudent(evt: any) {
    this.fileStudentName = evt.target.files[0].name;

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

  public async uploadStudent() {
    console.log(this.data);
    if (this.data == null) {
      Swal.fire('โปรดเลือกไฟล์!', '', 'error');
    } else {
      for (let i = 0; i < this.data.length; i++) {
        //  let getData: any = await this.http.get('admin/uploadStudent/'+this.data[i]);
        //  console.log(getData)
        let Form = new FormData();
        Object.keys(this.data[i]).forEach((key) => {
          Form.append(key, this.data[i][key]);
        });
        Form.append('group', this.codeGroup);
        let getData: any = await this.http.post('admin/uploadStudent', Form);
      }

      // this.getStudent();
      this.getEducational();
      this.fileStudentName = 'โปรดเลือกไฟล์';
      this.data = null;
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'เพิ่มข้อมูลสำเร็จ',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  // public async getStudent() {
  //   let formData = new FormData();
  //   formData.append('group', this.codeGroup);
  //   let getData: any = await this.http.post('admin/getStudent', formData);

  //   if (getData.connect) {
  //     if (getData.response.rowCount > 0) {
  //       this.dataStudent = getData.response.result;
  //     } else {
  //       this.dataStudent = null;
  //     }
  //   } else {
  //     Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
  //   }
  // }

  public deleteStudent = async (code: any) => {
    let formData = new FormData();
    formData.append('ID', code);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('admin/delStudent', formData);
        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            // this.getStudent();
            this.getEducational();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };
  public getYearTerm(e) {
    this.formYearTerm = this.formBuilder.group({
      year: [e, Validators.required],
      term: [this.formYearTerm.value.term, Validators.required],
    });
    this.getEducational();
  }
  public getTerm(e) {
    this.formYearTerm = this.formBuilder.group({
      year: [this.formYearTerm.value.year, Validators.required],
      term: [e, Validators.required],
    });
    this.getEducational();
  }

  public getYearStudy(e) {
    this.date_year = this.formBuilder.group({
      _year: [e, Validators.required],
    });
    this.getCalendar();
  }
  public getEducational = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    formData.append('year', this.formYearTerm.value.year);
    formData.append('term', this.formYearTerm.value.term);

    let getData: any = await this.http.post('admin/getEducational', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataEducational = getData.response.result;
      } else {
        this.dataEducational = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };

  public getYear = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.range[i] = { value: `${year - i}` };
    }
  };

  // public getGroup_branchHead = async () => {
  //   let formData = new FormData();
  //   formData.append(
  //     'parent',
  //     JSON.parse(localStorage.getItem('userLogin')).branch
  //   );
  //   let getData: any = await this.http.post(
  //     'teacher/getGroup_branchHead',
  //     formData
  //   );
  //   if (getData.connect) {
  //     if (getData.response.rowCount > 0) {
  //       this.dataGroup_branchHead = getData.response.result;
  //     } else {
  //       this.dataGroup_branchHead = null;
  //     }
  //   } else {
  //     Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
  //   }
  // };
  public clickCalendar = () => {
    this.date_student.reset();
    this.getYearCalendar();
  };

  public getYearCalendar = () => {
    var now = new Date();
    var year = 0 + now.getFullYear() + 543;
    for (var i = 0; i < 10; i++) {
      this.year_study[i] = { value: `${year - i}` };
    }
  };
  public insertCalendar = async () => {
    const momentDate = new Date(this.date_student.value.start);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    const momentDate2 = new Date(this.date_student.value.end);
    const formattedDate2 = moment(momentDate2).format('YYYY-MM-DD');
    let formData = new FormData();
    formData.append('year', this.date_student.value.selected_year);
    formData.append('term', this.date_student.value.selected_term);
    formData.append('start', formattedDate);
    formData.append('end', formattedDate2);

    if (formattedDate > formattedDate2) {
      Swal.fire(
        'ไม่สามารถเพิ่มปีการศึกษาได้',
        'วันเปิดเทอม - วันปิดเทอม ไม่ถูกต้อง',
        'error'
      );
    } else {
      let getData: any = await this.http.post('teacher/addCalendar', formData);
      console.log(getData);
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'เพิ่มข้อมูลสำเร็จ',
            showConfirmButton: false,
            timer: 1500,
          });
          let win: any = window;
          win.$('#addCalendar').modal('hide');
          this.getCalendar();
          setTimeout(function () {
            window.location.reload(true);
          }, 1500);
        } else if (getData.response.error) {
          Swal.fire(
            'ไม่สามารถเพิ่มปีการศึกษาได้',
            'ข้อมูลภาคการศึกษาซ้ำ',
            'error'
          );
        } else {
          Swal.fire('ไม่สามารถเพิ่มปีการศึกษาได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        //this.dataCURDATE.term = getData.response.result[0].term ;
        this.formYearTerm = this.formBuilder.group({
          year: [getData.response.result[0].year, Validators.required],
          term: [getData.response.result[0].term, Validators.required],
        });
        this.date_year.patchValue({
          _year: getData.response.result[0].year,
        });
        this.getCalendar();
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public getCalendar = async () => {
    let formData = new FormData();
    formData.append('year', this.date_year.value._year);
    let getData: any = await this.http.post('teacher/getCalendar', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataCalendar = getData.response.result;
      } else {
        this.dataCalendar = null;
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

  public deleteCalendar = async (year: any, term: any) => {
    let formData = new FormData();
    formData.append('year', year);
    formData.append('term', term);
    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post(
          'teacher/delCalendar',
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
            this.getCalendar();
            setTimeout(function () {
              window.location.reload(true);
            }, 1500);
            // window.location.reload();
          } else {
            Swal.fire('ไม่สามารถลบข้อมูลได้!', '', 'error');
          }
        }
      }
    });
  };

  public clickEditCalendar(data) {
    this.getYearCalendar();
    this.date_student = this.formBuilder.group({
      start: [data.date_start, Validators.required],
      end: [data.date_end, Validators.required],
      selected_year: [data.year, Validators.required],
      selected_term: [data.term, Validators.required],
      year: [data.year, Validators.required],
      term: [data.term, Validators.required],
    });
  }

  public updateCalendar = async () => {
    const momentDate = new Date(this.date_student.value.start);
    const formattedDate = moment(momentDate).format('YYYY-MM-DD');
    const momentDate2 = new Date(this.date_student.value.end);
    const formattedDate2 = moment(momentDate2).format('YYYY-MM-DD');
    let formData = new FormData();
    formData.append('year', this.date_student.value.selected_year);
    formData.append('term', this.date_student.value.selected_term);
    formData.append('start', formattedDate);
    formData.append('end', formattedDate2);
    formData.append('yearEdit', this.date_student.value.year);
    formData.append('termEdit', this.date_student.value.term);

    // formData.forEach((value, key) => {
    //   console.log(key + ':' + value);
    // });

    if (formattedDate > formattedDate2) {
      Swal.fire(
        'ไม่สามารถเพิ่มปีการศึกษาได้',
        'วันเปิดเทอม - วันปิดเทอม ไม่ถูกต้อง',
        'error'
      );
    } else {
      let getData: any = await this.http.post(
        'teacher/updateCalendar',
        formData
      );

      if (getData.connect) {
        if (getData.response.rowCount > 0) {
          let win: any = window;
          win.$('#editCalendar').modal('hide');
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          this.getCalendar();
        } else if (getData.response.error) {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', 'ภาคการศึกษาซ้ำ', 'error');
        } else {
          Swal.fire('แก้ไขข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };
}
