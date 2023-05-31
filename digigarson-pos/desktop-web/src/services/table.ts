import { Service as HService } from "services/http"

export default class Service {
    private Http: HService | null = null

    constructor(http: HService) {
        this.Http = http
    }

    public async get() {
        return await this.Http?.instance.get(`/tables`);
    }

    public async setPrint(id: string) {
        return await this.Http?.instance.put(`/tables/${id}`);
    }

    public async getById(id: string) {
        return await this.Http?.instance.get(`/tables/${id}`);
    }

    public async transfer(data: any) {
        return await this.Http?.instance.post(`/tables/transfer`,data);
    }
}