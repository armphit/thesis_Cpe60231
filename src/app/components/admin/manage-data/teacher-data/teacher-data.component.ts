import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-data',
  templateUrl: './teacher-data.component.html',
  styleUrls: ['./teacher-data.component.scss'],
})
export class TeacherDataComponent implements OnInit {
  public dataFaculty: any = null;
  public codeFaculty: any = null;
  public dataMajor: any = null;
  public nameMajor: any = null;
  public acronym: any = null;
  public codeMajor: any = null;
  public dataTeacher: any = null;
  public codeBranchhead: any = null;
  public inBranchhead: FormGroup;
  public dataBranchhead: any = null;
  public nameBranchhead: any = null;
  public IDBranchhead: any = null;
  public advisorID: any = null;
  public pageTeacher: number = 1;
  public teacher: FormGroup;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getFaculty();
  }

  ngOnInit(): void {
    this.inBranchhead = this.formBuilder.group({
      Branchhead: ['', Validators.required],
    });
    this.teacher = this.formBuilder.group({
      code: ['', Validators.required],
      titlename: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
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
    this.nameMajor = nameMajor;
    this.codeMajor = codeMajor;

    this.getBranchhead();
    this.getTeacher();
  }
  public getTeacher = async () => {
    let formData = new FormData();
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
  };

  public clickAdvisor(advisorID) {
    this.advisorID = advisorID;
  }

  public clearFrom() {
    this.inBranchhead.reset();
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
  public deleteTeacher = async (id: any) => {
    let formData = new FormData();
    formData.append('id', id);

    this.http.confirmAlert('ลบรายการนี้หรือไม่?').then(async (value: any) => {
      if (value) {
        let getData: any = await this.http.post('admin/delTeacher', formData);
        console.log(getData);
        if (getData.connect) {
          if (getData.response.rowCount > 0) {
            Swal.fire({
              position: 'top',
              icon: 'success',
              title: 'ลบข้อมูลสำเร็จ',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getTeacher();
            this.getBranchhead();
          } else {
            Swal.fire(
              'ไม่สามารถลบข้อมูลได้!',
              'กรุณาเปลี่ยนหัวหน้าสาขาก่อนลบ!',
              'error'
            );
          }
        }
      }
    });
  };
  public insertTeacher = async () => {
    let formData = new FormData();
    var input = this.teacher.value.code.trim();
    formData.append('code', input);
    formData.append('titlename', this.teacher.value.titlename);
    formData.append('fname', this.teacher.value.fname);
    formData.append('lname', this.teacher.value.lname);
    formData.append('status', '2500');
    formData.append('branch', this.codeMajor);

    let getData: any = await this.http.post('admin/addTeacher', formData);
    // formData.forEach((value, key) => {
    // console.log(key + ':' + value);
    // });
    if (getData.connect) {
      if (getData.response.result) {
        Swal.fire('เพิ่มข้อมูลเสร็จสิ้น', '', 'success');
        let win: any = window;
        win.$('#addTeacher').modal('hide');
        this.getTeacher();
        this.teacher.reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เพิ่มข้อมูลไม่สำเร็จ',
          text: 'เลขที่ตำแหน่งซ้ำ',
        });
      }
    } else {
      Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
    }
  };
}
