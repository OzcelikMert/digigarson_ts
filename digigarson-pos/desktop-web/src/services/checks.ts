import { Service as HService } from "services/http"

export default class Service {
    private Http: HService | null = null

    constructor(http: HService) {
        this.Http = http
    }

    public async get(tableId: string) {
        return await this.Http?.instance.get(`/checks/${tableId}`);
    }

    public async getOld(checkId: string) {
        return await this.Http?.instance.get(`/checks/old/${checkId}`);
    }

    public async updateOld(checkId: string, data:any) {
        return await this.Http?.instance.put(`/checks/old/${checkId}`, data);
    }

    public async pay(tableId: string, data: any) {
        return await this.Http?.instance.post(`/checks/${tableId}/pay`, data);
    }

}