import { Injectable } from "@angular/core";
import { ImageInfo } from "../_model/_input/image-info";
import { FormatData } from "../_model/_output/format-data";
import { ModuleData } from "../_model/_output/_module/module-data";

@Injectable({ providedIn: 'root' })
export class ModuleService {
  constructor() {
  }

  public checkSizeIsCorrect(image: ImageInfo, formatData: FormatData): boolean {
    const width = formatData.firstSize;
    const height = formatData.secondSize;
    const delta = 5;

    return (Math.abs(image.width - width) <= delta) && (Math.abs(image.height - height) <= delta)
  }

  public recalculateDimension(dimension: number, resolution: number): number {
    return Math.round((dimension / resolution * 25.4 + Number.EPSILON) * 100) / 100;
  }

  public createSampleFile(base64String: string, fileName: string): File {
    const blob = this.dataURItoBlob(base64String);
    const file = new File([blob], fileName, { type: 'image/jpeg' });
    return file;
  }

  public createFile(moduleData: ModuleData): File {
    const blob = this.dataURItoBlob(moduleData.base64String);
    const file = new File([blob], moduleData.name);

    return file;
  }

  public fillImage(image: ImageInfo, name: string): void {
    image.file = this.createSampleFile(image.base64String, name);
    image.width = this.recalculateDimension(image.width, image.hResolution);
    image.height = this.recalculateDimension(image.height, image.vResolution);
  }

  public resetModuleData(moduleData: ModuleData): void {
    moduleData = new ModuleData();
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