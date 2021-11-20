import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { GraphicInfo } from "../_model/_input/graphic-info";
import { GraphicData } from "../_model/_output/graphic-data";
import { GraphicApiService } from "./graphic.api.service";

@Injectable({ providedIn: 'root' })
export class GraphicService {
    constructor(
        private graphicApiService: GraphicApiService
    ) {}
    
    public getWeekdays(): any[] {
        return [
            { name: 'Воскресенье', shortName: 'ВС' },
            { name: 'Понедельник', shortName: 'ПН' },
            { name: 'Вторник', shortName: 'ВТ' },
            { name: 'Среда', shortName: 'СР' },
            { name: 'Четверг', shortName: 'ЧТ' },
            { name: 'Пятница', shortName: 'ПТ' },
            { name: 'Суббота', shortName: 'СБ' }
        ];
    }

    public getGraphicParentIds(graphics: GraphicData[]): number[] {
        return graphics
            ? graphics.map(g => g.id)
            : [];
    }

    // Возвращает идентификаторы всех графиков, включая дочерние
    public getGraphicAllIds(graphics: GraphicData[]): number[] {
        return graphics
            ? this.getGraphicParentIds(graphics).concat(...graphics.map(g => g.childs.map(c => c)))
            : [];
    }

    // Возвращает идентификаторы графиков, которые есть в позиции заказа, но нет в списке графиков
    public getGraphicToLoadIds(graphicIds: number[], graphics: GraphicInfo[]): number[] {
        return graphicIds.filter(graphicId => graphics.findIndex(g => g.id == graphicId) < 0);
    }

    // Находит график по идентификатору в списке графиков
    public findById(graphics: GraphicInfo[], graphicId: number): GraphicInfo {
        return graphics.find(g => g.id === graphicId);
    }

    // Сортирует список графиков по возрастанию даты сдачи
    public sort(graphics: GraphicInfo[]): GraphicInfo[] {
        return graphics.sort((a, b) => new Date(a.outDate).getTime() - new Date(b.outDate).getTime());
    }

    // Фильтрует графики по выходу в заданный день недели
    public filter(graphics: GraphicInfo[], weekdayShortName: string): GraphicInfo[] {
        const weekdays = this.getWeekdays();
        const weekday = this.getWeekdays().find(wd => wd.shortName === weekdayShortName);
        return weekday
          ? graphics.filter(g => weekdays[g.outDate.getDay()].name.match(weekday.name))
          : graphics;
    }

    // Возвращает массив Observable-ов получения графика
    public mapGetGraphicCalls(graphicIds: number[]): Observable<GraphicInfo>[] {
        return graphicIds.map(graphicId => {
          return this.graphicApiService.getGraphic(graphicId);
        });
    }

    // Возвращает выбранные графики для позиции заказа
    public getCheckedGraphicsData(graphics: GraphicInfo[], packageLength: number): GraphicData[] {
        const graphicsData: GraphicData[] = [];
        for (let i = 0; i < graphics.length; i++) {
          if (graphics[i].isChecked) {
            const graphic = new GraphicData();
            graphic.id = graphics[i].id;
            for (let pi = 1; pi < packageLength; pi++) {
              graphic.childs.push(graphics[i + pi].id);
            }
            graphicsData.push(graphic);
          }
        }
        return graphicsData;
    }

    // Возвращает выходы выбранных графиков
    public getCheckedGraphicsOutDates(graphics: GraphicInfo[]): Date[] {
        const outDates = graphics.filter(g => g.isChecked).map(g => g.outDate);
        return outDates;
    }

    // Возвращает доступность графика для выбора
    public isGraphicEnabled(graphic: GraphicInfo, disableUnchecked: boolean, anotherOutDates: Date[], graphicsData: GraphicData[]): boolean {
        if (!disableUnchecked)
          return true;
    
        if (graphic.isChecked)
          return true;
    
        if (graphicsData.length == 0) {
          if (!(anotherOutDates && anotherOutDates.length > 0))
            return true;
    
          const enabled = this.isGraphicInAllowedRange(graphic.outDate, anotherOutDates);
          return enabled;
        }
    
        return false;
      }

    // Возвращает, доступне ли график в пакете
    private isGraphicInAllowedRange(graphicOutDate: Date, outDates: Date[]): boolean {
        const diff = Math.abs(new Date(graphicOutDate).getTime() - new Date(outDates[0]).getTime());
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
        return diffDays <= 7;
    }

}