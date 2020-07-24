import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

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
  public groupName: any = null;
  public file_curriculum: any = null;
  public dataBranchEdit: any = null;
  public acronymEdit: any = null;
  public updateFile: any = null;
  public codeGroup: any = null;
  public data: any = null;
  public dataStudent: any = null;
  public range: Array<any> = [];
  term: any = null;
  selected: any = null;
  public formYearTerm: FormGroup;
  public dataEducational: any = null;
  public dataGroup_branchHead: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getGroup();
    this.getBranchhead();
    this.getAdvisor();
    this.getYear();
    this.getGroup_branchHead();
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      group: ['', Validators.required],
      brunch: ['', Validators.required],
      upload: ['', Validators.required],
    });

    this.formCurriculum = this.formBuilder.group({
      groupEdit: ['', Validators.required],
      brunchEdit: ['', Validators.required],
    });

    this.formYearTerm = this.formBuilder.group({
      year: ['', Validators.required],
      term: ['', Validators.required],
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
      this.formGroup.value.upload = file;
    }
  }

  public insertGroup = async () => {
    let formData = new FormData();
    formData.append(
      'group_name',
      this.acronym + '.' + this.formGroup.value.group.toUpperCase()
    );
    formData.append('upload', this.formGroup.value.upload);
    formData.append('branch', this.formGroup.value.brunch);
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);

    // formData.append('ID', this.inGroup.value.getTC);
    let getData: any = await this.http.post('teacher/addGroup', formData);

    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มกลุ่มเรียนเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addGroup').modal('hide');
        this.getGroup();
      } else {
        Swal.fire('ไม่สามารถเพิ่มกลุ่มเรียนได้', 'กลุ่มเรียนซ้ำ', 'error');
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
  public clearFrom() {
    this.formGroup.reset();
  }

  public clickUpdateGroup(
    study_group_id,
    study_group_name,
    file_curriculum,
    branch_id
  ) {
    let a = study_group_name.split('.', 1);
    let b = study_group_name.replace(a + '.', '');

    this.groupID = study_group_id;
    this.groupName = study_group_name;
    this.file_curriculum = file_curriculum;
    this.formCurriculum = this.formBuilder.group({
      groupEdit: [b, Validators.required],
      brunchEdit: [branch_id, Validators.required],
    });
    this.getBranchEdit();
    this.updateFile = null;
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
    }
  }

  public clickBranchEdit(codeBranch) {
    this.formCurriculum.value.brunchEdit = codeBranch;
  }

  async clickUploadCurriculum() {
    let formData = new FormData();

    formData.append('group', this.groupID);
    formData.append('upload', this.updateFile);
    formData.append(
      'group_name',
      this.acronymEdit + '.' + this.formCurriculum.value.groupEdit
    );
    formData.append('branch_id', this.formCurriculum.value.brunchEdit);
    formData.append('curriculum', this.file_curriculum);
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
    // this.filesName = evt.target.files[0].name;

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
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: 'เพิ่มข้อมูลสำเร็จ',
      showConfirmButton: false,
      timer: 1500,
    });
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
  public getTerm(e) {
    this.getEducational();
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
      this.range[i] = { value: year - i };
    }
  };

  public getGroup_branchHead = async () => {
    let formData = new FormData();
    formData.append(
      'parent',
      JSON.parse(localStorage.getItem('userLogin')).branch
    );
    let getData: any = await this.http.post(
      'teacher/getGroup_branchHead',
      formData
    );
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataGroup_branchHead = getData.response.result;
      } else {
        this.dataGroup_branchHead = null;
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
}
