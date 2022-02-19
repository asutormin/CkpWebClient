import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModulePartParams } from '../../../../_model/_output/_module/module-part-params';

@Component({
  selector: 'app-part-builder',
  templateUrl: './part-builder.component.html',
  styleUrls: ['./part-builder.component.scss']
})
export class PartBuilderComponent implements OnInit {
  @Input() public PartName: string;
  @Input() public TextFieldName: string;
  @Input() public TextFieldPlaceholder: string;
  @Input() public ModulePartParams: ModulePartParams;

  @Output() public modulePartCahnged = new EventEmitter();

  public fontFamilies: string[] = [
    'Abbat',
    'AbbatExtra',
    'AbbatNew',
    'AbbatNewExtra'
  ];
  public currentFontFamily: string;

  public fontSizes: number[] = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
  public currentFontSize: number;

  public fontStyles: any[] = [
    { id: 0, name: 'Normal' },
    { id: 1, name: 'Bold' },
    { id: 2, name: 'Italic' },
    { id: 3, name: 'BoldItalic' }
  ];
  public currentFontStyle: any;

  public horizontalAlignments: any[] = [
    { id: 0, name: 'По левому краю' },
    { id: 1, name: 'По центру' },
    { id: 2, name: 'По правому краю' }
  ];
  public currentHorizontalAlignment: any;

  public verticalAlignments: any[] = [
    { id: 0, name: 'По верхнему краю' },
    { id: 1, name: 'По центру' },
    { id: 2, name: 'По нижнему краю' }
  ];
  public currentVerticalAlignment: any;

  public textColors: any[] = [
    { r: 0, g: 0, b: 0 },
    { r: 30, g: 144, b: 255 },
    { r: 254, g: 26, b: 38 },
    { r: 77, g: 138, b: 100 },
    { r: 114, g: 51, b: 255 },
    { r: 12, g: 65, b: 255 },
    { r: 0, g: 255, b: 86 },
    { r: 255, g: 255, b: 255 }
  ];
  public currentTextColor: any;

  public backgroundColors: any[] = [
    { r: 255, g: 255, b: 255 },
    { r: 255, g: 203, b: 239 },
    { r: 255, g: 178, b: 218 },
    { r: 225, g: 255, b: 225 },
    { r: 230, g: 191, b: 255 },
    { r: 30, g: 143, b: 255 },
    { r: 180, g: 255, b: 230 },
    { r: 255, g: 255, b: 255 }
  ];
  public currentBackgroundColor: any;

  public currentText: string;

  constructor() { }

  public ngOnInit(): void {
    this.reset();
  }

  public reset(): void {
    this.currentFontFamily = this.fontFamilies[0];
    this.ModulePartParams.fontFamilyName = this.currentFontFamily;

    this.currentFontSize = this.fontSizes[0];
    this.ModulePartParams.fontSize = this.currentFontSize;

    this.currentFontStyle = this.fontStyles[0];
    this.ModulePartParams.fontStyleName = this.currentFontStyle.name;

    this.currentVerticalAlignment = this.verticalAlignments[0];
    this.ModulePartParams.verticalAlignmentId = this.currentVerticalAlignment.id;

    this.currentHorizontalAlignment = this.horizontalAlignments[0];
    this.ModulePartParams.horizontalAlignmentId = this.currentHorizontalAlignment.id;

    this.currentTextColor = this.textColors[0];
    this.ModulePartParams.textColor = this.currentTextColor;

    this.currentBackgroundColor = this.backgroundColors[0];
    this.ModulePartParams.backgroundColor = this.currentBackgroundColor;

    this.currentText = '';
    this.ModulePartParams.text = this.currentText;
  }

  public getColor(color: any): string {
    if (color === undefined) {
      return `rgb(255, 255, 255)`;
    } else {
      return `rgb(${color.r}, ${color.g}, ${color.b})`;
    }
  }

  public onModulePartChanged(): void {
    this.modulePartCahnged.emit();
  }

  public onFontFamilyChanged(): void {
    this.ModulePartParams.fontFamilyName = this.currentFontFamily;
    this.onModulePartChanged();
  }

  public onFontSizeChanged(): void {
    this.ModulePartParams.fontSize = this.currentFontSize;
    this.onModulePartChanged();
  }

  public onFontStyleChanged(): void {
    this.ModulePartParams.fontStyleName = this.currentFontStyle.name;
    this.onModulePartChanged();
  }

  public onVerticalAlignmentChanged(): void {
    this.ModulePartParams.verticalAlignmentId = this.currentVerticalAlignment.id;
    this.onModulePartChanged();
  }

  public onHorizontalAlignmentChanged(): void {
    this.ModulePartParams.horizontalAlignmentId = this.currentHorizontalAlignment.id;
    this.onModulePartChanged();
  }

  public onTextColorChanged(): void {
    this.ModulePartParams.textColor = this.currentTextColor;
    this.onModulePartChanged();
  }

  public onBackgroundColorChanged(): void {
    this.ModulePartParams.backgroundColor = this.currentBackgroundColor;
    this.onModulePartChanged();
  }

  public onTextChanged(): void {
    this.ModulePartParams.text = this.currentText;
    this.onModulePartChanged();
  }
}
