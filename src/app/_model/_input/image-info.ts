export class ImageInfo {
  width: number;
  height: number;
  vResolution: number;
  hResolution: number;
  base64String: string;
  file: File;

  constructor() {
    this.width = 0;
    this.height = 0;
    this.vResolution = 0;
    this.hResolution = 0;
    this.base64String = '';
  }
}
