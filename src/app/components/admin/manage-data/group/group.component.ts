import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss'],
})
export class GroupComponent implements OnInit {
  public dataFaculty: any = null;
  public codeFaculty: any = null;
  public dataMajor: any = null;
  public nameMajor: any = null;
  public acronym: any = null;
  public inGroup: FormGroup;
  public codeMajor: any = null;
  public dataBranch: any = null;
  public codeBranch: any = null;
  public dataTeacher: any = null;
  public codeBranchhead: any = null;
  public inBranchhead: FormGroup;
  public dataBranchhead: any = null;
  public nameBranchhead: any = null;
  public IDBranchhead: any = null;
  public advisorID: any = null;
  public dataGroup: any = null;
  public groupUser_edit: any = null;
  public groupID_edit: any = null;
  public filesName2: any = 'โปรดเลือกไฟล์';
  public nameBranch: any = null;
  public uploadCurriculumFile: File;
  public curriculumFileupdate: File;
  public filesName3: any = 'โปรดเลือกไฟล์';
  public formCurriculum: FormGroup;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
  }

  ngOnInit(): void {
    this.inGroup = this.formBuilder.group({
      group: ['', Validators.required],
      advisorID: ['', Validators.required],
    });

    this.inBranchhead = this.formBuilder.group({
      Branchhead: ['', Validators.required],
    });

    this.formCurriculum = this.formBuilder.group({
      updateFile: ['', Validators.required],
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
    // this.dataStudent_id = null;
    // this.groupID = null;
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

    formData.append('ID', this.codeMajor);
    let getData2: any = await this.http.post('admin/getTeacher', formData);
    if (getData2.connect) {
      if (getData2.response.rowCount > 0) {
        this.dataTeacher = getData2.response.result;
      } else {
        this.dataTeacher = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
    this.getBranchhead();
    this.getGroup();
  }

  public clickBranch(codeBranch, name, acronym) {
    this.nameBranch = name;
    this.acronym = acronym;
    this.codeBranch = codeBranch;
    this.getGroup();
  }

  public clickAdvisor(advisorID) {
    this.advisorID = advisorID;
  }

  public clearFrom() {
    this.inGroup.reset();
    this.inBranchhead.reset();
    this.uploadCurriculumFile = null;
    this.filesName2 = 'โปรดเลือกไฟล์';
  }

  public getIDBranchhead(codeBranchhead) {
    this.codeBranchhead = codeBranchhead;
    this.inBranchhead = this.formBuilder.group({
      Branchhead: [codeBranchhead, Validators.required],
    });
  }

  public async updateBranchhead() {
    let formData = new FormData();
    formData.append('code', this.codeMajor);
    formData.append('ID', this.inBranchhead.value.Branchhead);

    if (this.codeBranchhead == this.inBranchhead.value.Branchhead) {
      Swal.fire('กรุณาเลือกอาจารย์อีกครั้ง!', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'admin/updateBranchhead',
        formData
      );
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
          let win: any = window;
          win.$('#addHead').modal('hide');
          this.getBranchhead();
        } else {
          Swal.fire('แก้ไขข้อมูลข้อมูลไม่ได้', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  }

  public getBranchhead = async () => {
    let formData = new FormData();
    formData.append('code', this.codeMajor);
    let getData: any = await this.http.post('admin/getBranchhead', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataBranchhead = getData.response.result;
      } else {
        this.dataBranchhead = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
    this.IDBranchhead = getData.response.result[0].userID;
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
  };

  uploadCurriculum(file) {
    if (file) {
      this.uploadCurriculumFile = file;
      this.filesName2 = file.name;
    }
  }

  public insertGroup = async () => {
    let formData = new FormData();
    var input = this.inGroup.value.group.trim();
    formData.append('group_name', this.acronym + '.' + input.toUpperCase());
    formData.append('ID', this.inGroup.value.advisorID);
    formData.append('branch', this.codeBranch);
    formData.append('upload', this.uploadCurriculumFile);
    if (this.uploadCurriculumFile == null) {
      Swal.fire('เพิ่มข้อมูลไม่ได้', 'โปรดเลือกไฟล์', 'error');
    } else {
      // formData.append('ID', this.inGroup.value.getTC);
      let getData: any = await this.http.post('admin/addGroup', formData);
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
          let win: any = window;
          win.$('#addGroup').modal('hide');
          this.getGroup();
        } else {
          Swal.fire({
            icon: 'error',
            title: 'แก้ไขข้อข้อมูลไม่สำเร็จ',
            text: 'กลุ่มเรียนซ้ำ!',
          });
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

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

  public getIDgroup = async (advisorID: any, group_id: any, group_name) => {
    this.curriculumFileupdate = null;
    this.filesName3 = 'โปรดเลือกไฟล์';
    let a = group_name.split('.', 1);
    let b = group_name.replace(a + '.', '');

    this.inGroup = this.formBuilder.group({
      group: [b, Validators.required],
      advisorID: [advisorID, Validators.required],
    });
    this.groupID_edit = group_id;
    this.groupUser_edit = advisorID;
  };
  uploadCurriculumUpdate(file) {
    if (file) {
      this.curriculumFileupdate = file;
      this.filesName3 = file.name;
    }
  }

  public updateGroup = async () => {
    let formData = new FormData();
    var input = this.inGroup.value.group.trim();
    formData.append('ID', this.inGroup.value.advisorID);
    formData.append('group_name', this.acronym + '.' + input.toUpperCase());
    formData.append('group_id', this.groupID_edit);
    formData.append('upload', this.curriculumFileupdate);

    let getData: any = await this.http.post('admin/updateGroup', formData);

    if (getData.connect) {
      if (getData.response.result) {
        let win: any = window;
        win.$('#updateGroup').modal('hide');
        Swal.fire('แก้ไขข้อมูลเสร็จสิ้น', '', 'success');
        this.getGroup();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'แก้ไขข้อข้อมูลไม่สำเร็จ',
          text: 'กลุ่มเรียนซ้ำ!',
        });
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
}
