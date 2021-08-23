import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SharedService {
    private orderPositionId: number;

    public get OrderPositionId() {
        return this.orderPositionId;
    }

    public set OrderPositionId(value: number) {
        if (this.orderPositionId !== value)
            this.orderPositionId = value;
    }
}