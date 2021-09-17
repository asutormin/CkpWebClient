import { AfterContentChecked, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { GraphicInfo } from '../../../_model/_input/graphic-info';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { GraphicData } from '../../../_model/_output/graphic-data';
import { EventService, EventType } from '../../../_services/event.service';
import { SupplierService } from 'src/app/_services/supplier.service';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit, OnDestroy, AfterContentChecked {

  private gSub: Subscription;
  private cgSub: Subscription;
  private chckgSub: Subscription;
  private pgSub: Subscription;

  private firstPackagePositionOutDates: Date[];

  public weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];

  @Input() public orderPositionData: OrderPositionData;
  @Input() public submitted = false;
  @Input() public disableUnchecked = false;

  public graphics: GraphicInfo[] = [];
  public graphicsToDisplay: GraphicInfo[];

  public get Valid(): boolean {
    return this.orderPositionData.graphicsData.length > 0;
  }

  constructor(
    private supplierService: SupplierService,
    private eventService: EventService,
    private cdRef: ChangeDetectorRef
  ) { }

  public ngOnInit() {
    this.gSub = this.supplierService.getGraphics(
      this.orderPositionData.supplierId, this.orderPositionData.formatData.formatTypeId)
      .subscribe(graphics => {
        this.graphics = graphics;
        this.orderPositionData.graphicsData.forEach(gr => {
          let checkedGraphic = this.graphics.find(g => g.id === gr.id);
          if (checkedGraphic === undefined) {
            this.chckgSub = this.supplierService.getGraphic(gr.id).subscribe(cg => {
              checkedGraphic = cg;
              checkedGraphic.isChecked = true;
              this.graphics.push(checkedGraphic);
              this.graphics = this.graphics.sort((a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime());
            });
            gr.childs.forEach(id => {
              this.cgSub = this.supplierService.getGraphic(id).subscribe(cgr => {
                if (this.graphics.findIndex(grc => grc.id === cgr.id) < 0) {
                  this.graphics.push(cgr);
                  this.graphics = this.graphics.sort((a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime());
                }
              });
            });
          } else {
            checkedGraphic.isChecked = true;
          }
        });
        this.graphics = this.graphics.sort((a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime());
      });

    if (this.disableUnchecked) {
      this.pgSub = this.eventService.on(EventType.AdvGraphics_Changed, this)
        .subscribe(value => {
          this.firstPackagePositionOutDates = value;
        });
    }
  }

  public ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  public ngOnDestroy(): void {
    if (this.gSub) {
      this.gSub.unsubscribe();
    }
    if (this.cgSub) {
      this.cgSub.unsubscribe();
    }
    if (this.chckgSub) {
      this.chckgSub.unsubscribe();
    }
    if (this.pgSub) {
      this.pgSub.unsubscribe();
    }
  }

  public getPageData($event: any) {
    this.graphicsToDisplay = $event.data;
  }

  public onGraphicChanged($event: Event) {
    this.orderPositionData.graphicsData = [];
    for (let i = 0; i < this.graphics.length; i++) {
      if (this.graphics[i].isChecked) {
        const graphic = new GraphicData();
        graphic.id = this.graphics[i].id;
        for (let pi = 1; pi < this.orderPositionData.formatData.packageLength; pi++) {
          graphic.childs.push(this.graphics[i + pi].id);
        }
        this.orderPositionData.graphicsData.push(graphic);
      }
    }

    if (this.disableUnchecked) {
      const outDates = this.graphics
        .filter(g => this.orderPositionData.graphicsData.map(g => g.id).indexOf(g.id) >= 0)
        .map(g => g.outDate);
      this.eventService.emit(EventType.AdvGraphics_Changed, outDates, this);
    }
  }

  public isPackageGraphicEnabled(graphicOutDate: Date): boolean {
    if (!this.firstPackagePositionOutDates ||
      this.firstPackagePositionOutDates.length === 0) {
      return true;
    }

    const diff = Math.abs(
      new Date(graphicOutDate).getTime() - new Date(this.firstPackagePositionOutDates[0]).getTime());
    const diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return diffDays <= 7;
  }

}
