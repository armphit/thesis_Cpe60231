import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-advice-data',
  templateUrl: './advice-data.component.html',
  styleUrls: ['./advice-data.component.scss']
})
export class AdviceDataComponent implements OnInit {

  public codeGroup: any = null;
  public dataGroup: any = null;
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
  public dataReply = {"subject_advice":null,"detail":null};
  public dataAdvice_notNull: any = null;




  constructor(public http: HttpService) {

    this.getGroup()

  }

  ngOnInit(): void {
  }
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
    this.getAdvice();
    this.getAdvice_notNull();
  }

  public getAdvice = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post('teacher/getAdvice', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvice = getData.response.result;
      } else {
        this.dataAdvice = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

  public getDate(date: any) {

    var d = new Date(date);

    return (
      this.thday[d.getDay()] +
      '  ' +
      d.getDate() +
      '  ' +
      this.thmonth[d.getMonth()] +
      '  ' +
      (d.getFullYear() + 543)
    );
  }
  public clickReply(dataReply) {

    this.dataReply.subject_advice = dataReply.subject_advice;
    this.dataReply.detail = dataReply.detail;
    console.log(this.dataReply)
  }

  public getAdvice_notNull = async () => {
    let formData = new FormData();
    formData.append('group', this.codeGroup);
    let getData: any = await this.http.post('teacher/getAdvice_notNull', formData);
    if (getData.connect) {
      if (getData.response.rowCount > 0) {
        this.dataAdvice_notNull = getData.response.result;
      } else {
        this.dataAdvice_notNull = null;
      }
    } else {
      alert('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    }
  };

}
