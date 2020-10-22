import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public PathPDF: string = 'http://cpe.rmuti.ac.th/project/advisor/api';
  public test: any = null;
  public rootPath: string =
    'http://cpe.rmuti.ac.th/project/advisor/api/index.php/';
  public loading: boolean = false;
  constructor(public router: Router, private http: HttpClient) {}

  public post = async (path: string, formdata: any = null) => {
    this.loading = true;
    let delayres = await this.delay(500);
    return new Promise((resolve) => {
      this.http
        .post(this.rootPath + path, formdata)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
          this.loading = false;
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
          this.loading = false;
        });
    });
  };

  public get = async (path: string) => {
    this.loading = true;
    let delayres = await this.delay(500);
    return new Promise((resolve) => {
      this.http
        .get(this.rootPath + path)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
          this.loading = false;
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
          this.loading = false;
        });
    });
  };

  public delay(delayInms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  }

  public post_ = async (path: string, formdata: any = null) => {
    this.loading = true;
    return new Promise((resolve) => {
      this.http
        .post(this.rootPath + path, formdata)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
          this.loading = false;
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
          this.loading = false;
        });
    });
  };

  public get_ = async (path: string) => {
    this.loading = true;
    return new Promise((resolve) => {
      this.http
        .get(this.rootPath + path)
        .toPromise()
        .then((value) => {
          resolve({ connect: true, response: value });
          this.loading = false;
        })
        .catch((reason) => {
          resolve({ connect: false, response: reason });
          this.loading = false;
        });
    });
  };

  public navRouter = (path: string, params: any = {}) => {
    this.router.navigate([`${path}`], { queryParams: params });
  };

  public confirmAlert = (title: string, text: string = '') => {
    return new Promise((resolve) => {
      Swal.fire({
        title: title,
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#007BFF',
        cancelButtonColor: '#DC3545',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
        focusCancel: true,
        focusConfirm: false,
      }).then((result) => {
        if (result.value) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  };

  public alertLog = (type: 'error' | 'success', title: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,

      onOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    switch (type) {
      case 'success':
        Toast.fire({
          icon: type,
          title: title,
        });
        break;
      case 'error':
        Toast.fire({
          icon: type,
          title: title,
        });
        break;
    }
  };
}
