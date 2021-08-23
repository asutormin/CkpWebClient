import { Component, Input, OnInit } from '@angular/core';
import { ModuleService } from '../../../../_services/module.service';
import { ImageInfo } from '../../../../_model/_input/image-info';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { OrderPositionData } from 'src/app/_model/_output/order-position-data';
import { ModuleData } from '../../../../_model/_output/_module/module-data';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Input() public orderPositionData: OrderPositionData;

  public samples: ImageInfo[] = [];
  public submitted = false;

  public get Valid(): boolean {
    return this.submitted && this.samples.length > 0;
  }

  constructor(
    private modulesService: ModuleService
  ) { }

  public ngOnInit(): void {
    if (!this.orderPositionData.moduleData.base64String) {
       return;
    }

    const blob = this.dataURItoBlob(this.orderPositionData.moduleData.base64String);
    const module = new File([blob], this.orderPositionData.moduleData.name);

    this.modulesService.createSample(module).subscribe(
      sample => {
        sample.file = this.createSampleFile(sample.base64String, '');
        sample.width = this.recalculateDimension(sample.width, sample.hResolution);
        sample.height = this.recalculateDimension(sample.height, sample.vResolution);
        this.samples.push(sample);
      }
    );
  }

  public onSelect($event: NgxDropzoneChangeEvent): void {

    const module = $event.addedFiles[0];

    this.modulesService.createSample(module).subscribe(
      sample => {
        if (this.samples && this.samples.length >= 1) {
          this.onRemove(this.samples[0]);
        }

        sample.file = this.createSampleFile(sample.base64String, module.name);
        sample.width = this.recalculateDimension(sample.width, sample.hResolution);
        sample.height = this.recalculateDimension(sample.height, sample.vResolution);

        this.checkImageSize(sample);
        this.samples.push(sample);

        const reader = new FileReader();
        reader.readAsDataURL(module);
        reader.onload = () => {
          this.orderPositionData.moduleData.base64String = reader.result as string;
          this.orderPositionData.moduleData.name = module.name;
        };
      });
  }

  public onRemove(sample: any): void {
    this.samples.splice(this.samples.indexOf(sample), 1);
  }

  public clear(): void {
    this.orderPositionData.moduleData = new ModuleData();
    this.samples = [];
  }

  private checkImageSize(image: ImageInfo): void {
    if (
      image.width !== this.orderPositionData.formatData.firstSize ||
      image.height !== this.orderPositionData.formatData.secondSize) {
      // tslint:disable-next-line:max-line-length
      alert('Размер подгруженного макета (' + image.width + ' x ' + image.height + ') не совпадает с требованием формата (' + this.orderPositionData.formatData.firstSize + ' x ' + this.orderPositionData.formatData.secondSize + ').');
    }
  }

  private recalculateDimension(dimension: number, resolution: number): number {
    return Math.round((dimension / resolution * 25.4 + Number.EPSILON) * 100) / 100;
  }

  private createSampleFile(base64String: string, fileName: string): File {
    const blob = this.dataURItoBlob(base64String);
    const file = new File([blob], fileName, { type: 'image/jpeg' });
    return file;
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
