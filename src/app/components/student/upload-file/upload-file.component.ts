import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  public dataStudent: any = null;
  public range: Array<any> = [];
  term: any = null;
  selected: any = null;
  file: File = null;
  public filesName: any = 'โปรดเลือกไฟล์';
  public filesNameHistory: any = 'โปรดเลือกไฟล์';
  public fileHistory: any = null;
  public fileUpload: FormGroup;
  selectUpload: any = null;
  public getHistory: any = null;
  public timetable: any = null;
  public results: any = null;
  public dataCurriculum: any = null;
  public clickChange: any = null;

  constructor(public http: HttpService, private formBuilder: FormBuilder) {
    this.getStudent();
    this.getYear();
    this.getCurriculum();
    this.getCURDATE();
  }

  ngOnInit(): void {
    this.fileUpload = this.formBuilder.group({
      year: ['', Validators.required],
      term: ['', Validators.required],
    });
  }

  public getStudent = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    let getData: any = await this.http.post('student/getStudent', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataStudent = getData.response.result;
        this.getHistory = getData.response.result[0].file_profile;
      } else {
        this.dataStudent = null;
        this.getHistory = null;
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

  uploadFile(file) {
    if (file) {
      this.filesName = file.name;
      this.file = file;
    } else {
      this.filesName = ' ';
    }
  }

  onClickupload = async () => {
    let formData = new FormData();
    // console.log(this.fileUpload.value.resultsFile);
    formData.append('select', this.selectUpload);
    formData.append('upload', this.file);
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('year', this.fileUpload.value.year);
    formData.append('term', this.fileUpload.value.term);

    if (this.file == null) {
      Swal.fire('โปรดเลือกไฟล์', '', 'error');
    } else if (this.selectUpload == null) {
      Swal.fire('โปรดเลือกไฟล์ที่ต้องการ', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'student/addUploadfile',
        formData
      );
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
          this.getEducation();
          this.filesName = 'โปรดเลือกไฟล์';
          this.file = null;
          this.selectUpload = 'โปรดเลือกไฟล์ที่ต้องการ';
          this.clickChange = null;
        } else {
          Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  public getYearTerm(e) {
    this.fileUpload = this.formBuilder.group({
      year: [e, Validators.required],
      term: [this.fileUpload.value.term, Validators.required],
    });
    this.getEducation();
    this.selectUpload = 'โปรดเลือกไฟล์ที่ต้องการ';
    this.filesName = 'โปรดเลือกไฟล์';
    this.file = null;
    this.clickChange = null;
  }
  public getTerm(e) {
    this.fileUpload = this.formBuilder.group({
      year: [this.fileUpload.value.year, Validators.required],
      term: [e, Validators.required],
    });
    this.getEducation();
    this.selectUpload = 'โปรดเลือกไฟล์ที่ต้องการ';
    this.filesName = 'โปรดเลือกไฟล์';
    this.file = null;
    this.clickChange = null;
  }

  public getStudy(e) {
    this.filesName = 'โปรดเลือกไฟล์';
    this.file = null;
    this.clickChange = e;
  }

  public getEducation = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('term', this.fileUpload.value.term);
    formData.append('year', this.fileUpload.value.year);
    let getData: any = await this.http.post('student/getEducation', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.timetable = getData.response.result[0].file_class_schedule;
        this.results = getData.response.result[0].file_course;
      } else {
        this.timetable = null;
        this.results = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  uploadHistory(file) {
    if (file) {
      this.filesNameHistory = file.name;
      this.fileHistory = file;
    } else {
      this.filesNameHistory = '';
    }
  }

  onClickuploadHistory = async () => {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);
    formData.append('upload', this.fileHistory);
    formData.append('history', this.getHistory);

    if (this.fileHistory == null) {
      Swal.fire('โปรดเลือกไฟล์', '', 'error');
    } else {
      let getData: any = await this.http.post(
        'student/addUploadHistory',
        formData
      );
      if (getData.connect) {
        if (getData.response.result) {
          Swal.fire('เพิ่มข้อมูลสำเร็จ', '', 'success');
          this.getStudent();
          this.filesNameHistory = 'โปรดเลือกไฟล์';
          this.fileHistory = null;
        } else {
          Swal.fire('เพิ่มข้อมูลไม่สำเร็จ', '', 'error');
        }
      } else {
        Swal.fire('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้!', '', 'error');
      }
    }
  };

  public async getCurriculum() {
    let formData = new FormData();
    formData.append('ID', JSON.parse(localStorage.getItem('userLogin')).userID);

    let getData: any = await this.http.post('student/getCurriculum', formData);

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataCurriculum = getData.response.result[0].file_curriculum;
      } else {
        this.dataCurriculum = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  }

  public getCURDATE = async () => {
    let getData: any = await this.http.post('teacher/getCURDATE');

    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.fileUpload = this.formBuilder.group({
          year: [getData.response.result[0].year, Validators.required],
          term: [getData.response.result[0].term, Validators.required],
        });
        this.getEducation();
      } else {
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };
}
