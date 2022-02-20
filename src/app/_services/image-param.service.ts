import { Injectable } from "@angular/core";
import { ImageInfo } from "../_model/_input/image-info";
import { FormatData } from "../_model/_output/format-data";

@Injectable({ providedIn: 'root' })
export class ImageParamService {
  constructor() {
  }

  public checkSizeIsCorrect(image: ImageInfo, formatData: FormatData): boolean {
    const width = formatData.firstSize;
    const height = formatData.secondSize;
    const delta = 5;

    return (Math.abs(image.width - width) <= delta) && (Math.abs(image.height - height) <= delta)
  }
}