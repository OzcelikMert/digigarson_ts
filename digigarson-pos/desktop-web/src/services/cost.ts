import { Service as HService } from "services/http"

export default class Service {
    private Http: HService | null = null

    constructor(http: HService) {
        this.Http = http
    }

    public async get() {
        return await this.Http?.instance.get(`/expenses`);
    }
    public async create(data: any) {
        return await this.Http?.instance.post(`/expenses`, data);
    }
}