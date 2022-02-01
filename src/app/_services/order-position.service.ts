import { Injectable } from "@angular/core";
import { FormatInfo } from "../_model/_input/format-info";
import { TariffInfo } from "../_model/_input/tariff-info";
import { FormatData } from "../_model/_output/format-data";
import { OrderPositionData } from "../_model/_output/order-position-data";
import { RubricData } from "../_model/_output/rubric-data";
import { ModuleData } from "../_model/_output/_module/module-data";
import { ContactData } from "../_model/_output/_string/contact-data";
import { LogoData } from "../_model/_output/_string/logo-data";
import { OccurrenceData } from "../_model/_output/_string/occurrence-data";
import { StringData } from "../_model/_output/_string/string-data";

@Injectable({ providedIn: 'root' })
export class OrderPositionService {

    public getSupplierId(orderPositionData: OrderPositionData): number {
        return orderPositionData.supplierId ?? 0;
    }

    public setSupplierId(orderPositionData: OrderPositionData, supplierId: number): void {
        orderPositionData.supplierId = supplierId;
    }

    public setPriceId(orderPositionData: OrderPositionData, priceId: number): void {
        orderPositionData.priceId = priceId;
    }

    public clearPriceId(orderPositionData: OrderPositionData): void {
        orderPositionData.priceId = 0;
    }

    public getFormatTypeId(orderPositionData: OrderPositionData): number {
        const formatData = orderPositionData.formatData;
        return (formatData && formatData.formatTypeId) ? formatData.formatTypeId : 0;
    }

    public getFormatName(orderPositionData: OrderPositionData): string {
        const formatData = orderPositionData.formatData;
        return (formatData && formatData.name) ? formatData.name : '';
    }

    public setFormatData(orderPositionData: OrderPositionData, format: FormatInfo) {
        orderPositionData.formatData.id = format.id;
        orderPositionData.formatData.name = format.name;
        orderPositionData.formatData.packageLength = format.packageLength;
        orderPositionData.formatData.firstSize = format.firstSize;
        orderPositionData.formatData.secondSize = format.secondSize;
        orderPositionData.formatData.version = format.version;
        orderPositionData.formatData.formatTypeId = format.type.id;
    }

    public createFormatData(orderPositionData: OrderPositionData): void {
        orderPositionData.formatData = new FormatData();
    }

    public clearGraphics(orderPositionData: OrderPositionData): void {
        orderPositionData.graphicsData = [];
    }

    public clearOrderPositionGraphics(orderPositionData: OrderPositionData): void {
        this.clearGraphics(orderPositionData);
        orderPositionData.childs.forEach(c => this.clearGraphics(c));
    }

    private createStringData(orderPositionData: OrderPositionData): void {
        orderPositionData.stringData = new StringData();
        orderPositionData.stringData.contactData = new ContactData();
        orderPositionData.stringData.phonesData = [];
        orderPositionData.stringData.emailsData = [];
        orderPositionData.stringData.occurrencesData = [];
        orderPositionData.stringData.occurrencesData.push(new OccurrenceData());
    }

    public setStringData(orderPositionData: OrderPositionData, stringData: StringData): void {
        orderPositionData.stringData = stringData;
    }

    private createModuleData(orderPositionData: OrderPositionData): void {
        orderPositionData.moduleData = new ModuleData();
    }

    public setModuleData(orderPositionData: OrderPositionData, moduleData: ModuleData): void {
        orderPositionData.moduleData = moduleData;
    }

    public createContentData(orderPositionData: OrderPositionData, format: FormatInfo): void {
        if (format.type.id === 1) {
            this.createStringData(orderPositionData);
        }
        if (format.type.id === 2) {
            this.createModuleData(orderPositionData);
        }
    }

    public clearContentData(orderPositionData: OrderPositionData): void {
        this.setStringData(orderPositionData, undefined);
        this.setModuleData(orderPositionData, undefined);
    }

    private isFirstTariffChanging(prevSupplierId: number, prevFormatTypeId: number): boolean {
        return !(prevSupplierId || prevFormatTypeId);
    }

    public canReCreateContentData(orderPositionData: OrderPositionData, prevSupplierId: number, prevFormatTypeId: number): boolean {
        if (this.isFirstTariffChanging(prevSupplierId, prevFormatTypeId) ||
            (orderPositionData.supplierId !== prevSupplierId || orderPositionData.formatData.formatTypeId !== prevFormatTypeId)) {
            return true;
        }
        return false;
    }

    private createOrderPosition(orderId: number, clientId: number, clientLegalPersonId: number, tariff: TariffInfo): OrderPositionData {
        const orderPositionData = new OrderPositionData();
        orderPositionData.orderId = orderId;
        orderPositionData.supplierId = tariff.supplier.id;
        orderPositionData.priceId = tariff.price.id;
        orderPositionData.formatData.id = tariff.format.id;
        orderPositionData.formatData.name = tariff.supplier.name + ': ' + tariff.format.name;
        orderPositionData.formatData.packageLength = tariff.format.packageLength;
        orderPositionData.formatData.firstSize = tariff.format.firstSize;
        orderPositionData.formatData.secondSize = tariff.format.secondSize;
        orderPositionData.formatData.version = tariff.format.version;
        orderPositionData.formatData.formatTypeId = tariff.format.type.id;
        orderPositionData.rubricData = new RubricData();
        orderPositionData.clientId = clientId;
        orderPositionData.clientLegalPersonId = clientLegalPersonId;

        this.createContentData(orderPositionData, tariff.format);

        return orderPositionData;
    }

    public createOrderPositionChilds(orderPositionData: OrderPositionData, tariff: TariffInfo): void {
        tariff.packageTariffs.forEach(pt => {
            const child = this.createOrderPosition(
                orderPositionData.orderId,
                orderPositionData.clientId,
                orderPositionData.clientLegalPersonId,
                pt);
            orderPositionData.childs.push(child);
        });
    }

    public clearChilds(orderPositionData: OrderPositionData): void {
        orderPositionData.childs = [];
    }

    public clearOrderPositionIds(orderPositionData: OrderPositionData): void {
        orderPositionData.orderId = 0;
        orderPositionData.orderPositionId = 0;
        orderPositionData.childs.forEach(c => this.clearOrderPositionIds(c));
    }

    public getCurrentTariff(orderPositionData: OrderPositionData, tariffs: TariffInfo[]): TariffInfo {
        let currentTariff;
        // Если тариф задан - находим его в списке
        if (orderPositionData.formatData.id && orderPositionData.priceId) {
            let filteredTariffsByFormat = tariffs.filter(t => t.format.id === orderPositionData.formatData.id);
            if (filteredTariffsByFormat && filteredTariffsByFormat.length > 0) {
                let filteredTariffsByPrice = filteredTariffsByFormat.filter(t => t.price.id === orderPositionData.priceId);
                currentTariff = filteredTariffsByPrice && filteredTariffsByPrice.length > 0
                    ? filteredTariffsByPrice[0]
                    : filteredTariffsByFormat[0];

                this.setPriceId(orderPositionData, currentTariff.price.id);
                this.setFormatData(orderPositionData, currentTariff.format);
            }
        }
        return currentTariff;
    }

    public canReCreateLogo(orderPositionData: OrderPositionData, prevFormatName: string, tariff: TariffInfo): boolean {
        const rdvSupplierId = 1678;
        if (orderPositionData.supplierId == rdvSupplierId && orderPositionData.formatData.formatTypeId == 1) {
            const formatWithLogoName = 'Строка с логотипом';
            // Если произошло переключение на строку с логотипом
            // или со строки с логотипом - сбрасываем логотип
            // (Проверка XOR)
            return prevFormatName.contains(formatWithLogoName) ?
                !tariff.format.name.contains(formatWithLogoName)
                : tariff.format.name.contains(formatWithLogoName);
        }
        return false;
    }

    public createLogo(stringData: StringData): void {
        if (stringData)
            stringData.logoData = new LogoData();
    }

    public canClearResponsibilityAndCondition(orderPositionData: OrderPositionData, prevFormatName: string, tariff: TariffInfo): boolean {
      const rrdSupplierIds = [ 4671, 5823, 6212];
      if (rrdSupplierIds.indexOf(orderPositionData.supplierId) > -1 && orderPositionData.formatData.formatTypeId == 1) {
        const formatStringMinName = 'Строка минимальная';
        return prevFormatName.contains(formatStringMinName)
            ? !tariff.format.name.contains(formatStringMinName)
            : tariff.format.name.contains(formatStringMinName);
      }
      return false;
    }

    public clearResponsibility(stringData: StringData): void {
        if (stringData)
            stringData.responsibility = '';
    }

    public clearConditionsValue(stringData: StringData): void {
        if (stringData)
            if (stringData.conditionsData)
                stringData.conditionsData.value = '';
    }
}