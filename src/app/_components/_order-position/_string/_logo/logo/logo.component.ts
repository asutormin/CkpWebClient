import { Component, Input, OnInit } from '@angular/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { LogoData } from '../../../../../_model/_output/_string/logo-data';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
})
export class LogoComponent implements OnInit {

  @Input() public logoData: LogoData;
  @Input() public submitted = false;

  public logos: File[] = [];

  public get Valid(): boolean {
    return this.submitted && this.logos.length === 0;
  }

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  public ngOnInit(): void {

    if (!this.logoData.base64String) {
      return;
    }

    const uri = (this.sanitizer.bypassSecurityTrustResourceUrl(this.logoData.base64String) as any).changingThisBreaksApplicationSecurity;
    const blob = this.dataURItoBlob(uri);
    const logo = new File([blob], this.logoData.fileName, { type: 'image/jpeg' });
    this.logos.push(logo);
  }

  public onSelect($event: NgxDropzoneChangeEvent): void {
    const logo = $event.addedFiles[0];

    if (this.logos && this.logos.length >= 1) {
      this.onRemove(this.logos[0]);
    }

    const reader = new FileReader();
    reader.readAsDataURL(logo);
    reader.onload = () => {
      this.logoData.base64String = reader.result as string;
      this.logoData.fileName = logo.name;
    };

    this.logos.push(logo);
  }

  public onRemove(logo: any): void {
    this.logos.splice(this.logos.indexOf(logo), 1);
    this.logoData.base64String = undefined;
    this.logoData.fileName = undefined;
  }

  private dataURItoBlob(dataURI): Blob {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
  }
}
