import { Component, Input, OnInit } from '@angular/core';
import { ModuleApiService } from '../../../../_services/module.api.service';
import { ImageInfo } from '../../../../_model/_input/image-info';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { OrderPositionData } from 'src/app/_model/_output/order-position-data';
import { ModuleService } from 'src/app/_services/module.service';

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
    private moduleApiService: ModuleApiService,
    private moduleService: ModuleService
  ) { }

  public ngOnInit(): void {
    if (!this.orderPositionData.moduleData.base64String) {
      return;
    }

    const file = this.moduleService.createFile(this.orderPositionData.moduleData);
    this.moduleApiService.createSample(file).subscribe(
      sample => {
        this.moduleService.fillImage(sample, '');
        this.samples.push(sample);
      }
    );
  }

  public onSelect($event: NgxDropzoneChangeEvent): void {
    const module = $event.addedFiles[0];

    this.moduleApiService.createSample(module).subscribe(
      sample => {
        if (this.samples && this.samples.length >= 1) {
          this.onRemove(this.samples[0]);
        }

        this.moduleService.fillImage(sample, module.name);

        if (this.moduleService.checkSizeIsCorrect(sample, this.orderPositionData.formatData)) {
          this.samples.push(sample);
        } else {
          this.showWrongSizeMessage(sample)
        }

        const reader = new FileReader();
        reader.readAsDataURL(module);
        reader.onload = () => {
          this.orderPositionData.moduleData.base64String = reader.result as string;
          this.orderPositionData.moduleData.name = module.name;
        };
      },
      err => alert(err.error.message)
    );
  }

  public onRemove(sample: any): void {
    this.samples.splice(this.samples.indexOf(sample), 1);
  }

  public clear(): void {
    this.moduleService.resetModuleData(this.orderPositionData.moduleData);
    this.samples = [];
  }

  private showWrongSizeMessage(image: ImageInfo): void {
    const width = this.orderPositionData.formatData.firstSize;
    const height = this.orderPositionData.formatData.secondSize;
    alert(
      'Размер подгруженного макета (' + image.width + ' x ' + image.height + ') не совпадает с требованием формата (' +
      width + ' x ' + height + '). Подгрузка не возможна. Допустимое отклонение - 5мм.');
  }
}
