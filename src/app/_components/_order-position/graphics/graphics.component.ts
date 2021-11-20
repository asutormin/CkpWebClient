import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { GraphicInfo } from '../../../_model/_input/graphic-info';
import { OrderPositionData } from '../../../_model/_output/order-position-data';
import { EventService, EventType } from '../../../_services/event.service';
import { GraphicApiService } from 'src/app/_services/graphic.api.service';
import { GraphicService } from 'src/app/_services/graphic.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.scss']
})
export class GraphicsComponent implements OnInit, OnDestroy {

  private gSub: Subscription;
  private pgSub: Subscription;
  private tSub: Subscription;

  private graphicsAll: GraphicInfo[];
  private anotherPackagePositionOutDates: Date[]; // Даты выхода других позиций пакета

  @Input() public orderPositionData: OrderPositionData;
  @Input() public submitted = false;
  @Input() public disableUnchecked = false; // Признак пакета (блокировать не выбранные графики)

  public weekdays: any[];
  public graphics: GraphicInfo[];
  public graphicsToDisplay: GraphicInfo[];

  public get Valid(): boolean {
    return this.orderPositionData.graphicsData.length > 0;
  }

  constructor(
    private graphicApiService: GraphicApiService,
    private graphicService: GraphicService,
    private eventService: EventService
  ) {
    this.graphicsAll = [];
    this.graphics = [];
    this.weekdays = this.graphicService.getWeekdays();
  }

  public ngOnInit() {
    const graphicAllIds = this.graphicService.getGraphicAllIds(this.orderPositionData.graphicsData);
    const graphicParentIds = this.graphicService.getGraphicParentIds(this.orderPositionData.graphicsData);
    const supplierId = this.orderPositionData.supplierId;
    const formatTypeId = this.orderPositionData.formatData.formatTypeId;

    this.gSub = this.graphicApiService.getGraphics(supplierId, formatTypeId).pipe(
      mergeMap(
        graphics => {
          this.graphicsAll = graphics;
          // Получаем идентификаторы не загруженных графиков
          const graphicToLoadIds = this.graphicService.getGraphicToLoadIds(graphicAllIds, graphics);
          return graphicToLoadIds.length > 0
            ? forkJoin(this.graphicService.mapGetGraphicCalls(graphicToLoadIds))
            : of([]);
        })).subscribe(
          graphicsLoaded => {
            // Добавляем подгруженные позднее графики
            this.graphicsAll = this.graphicsAll.concat(graphicsLoaded);
          },
          error => {
            console.log(error)
          },
          () => {
            // Сортируем графики по возрастанию
            this.graphicsAll = this.graphicService.sort(this.graphicsAll);
            // Проходим по графикам
            this.graphicsAll.forEach(graphic => {
              // И выбираем только родительские графики
              if (graphicParentIds.includes(graphic.id))
                graphic.isChecked = true;
            })
            // Подписываемся на изменение выбранного тарифа.
            this.tSub = this.eventService.on(EventType.Tariff_Changed, this).subscribe(
              shortName => {
                // Если в описании содержится день недели - отфильтровываем графики с выходом в этот день
                this.graphics = this.graphicService.filter(this.graphicsAll, shortName);
              }
            )
          }
        );

    if (this.disableUnchecked) {
      // Если у нас пакет - подписываемся на изменение графиков других позиций пакета
      this.pgSub = this.eventService.on(EventType.AdvGraphics_Changed, this).subscribe(
        value => this.anotherPackagePositionOutDates = value);
    }

  }

  public ngOnDestroy(): void {
    if (this.gSub)
      this.gSub.unsubscribe();

    if (this.pgSub)
      this.pgSub.unsubscribe();

    if (this.tSub)
      this.tSub.unsubscribe();
  }

  public getPageData($event: any) {
    this.graphicsToDisplay = $event.data;
  }

  public onGraphicChanged() {
    const packageLength = this.orderPositionData.formatData.packageLength;
    this.orderPositionData.graphicsData = this.graphicService.getCheckedGraphicsData(this.graphics, packageLength);

    if (this.disableUnchecked) {
      // Если у нас пакет - генерируем событие об изменении выбранного графика
      const outDates = this.graphicService.getCheckedGraphicsOutDates(this.graphics);
      this.eventService.emit(EventType.AdvGraphics_Changed, outDates, this);
    }
  }

  public isGraphicEnabled(graphic: GraphicInfo): boolean {
    return this.graphicService.isGraphicEnabled(
      graphic,
      this.disableUnchecked,
      this.anotherPackagePositionOutDates,
      this.orderPositionData.graphicsData);
  }
}