import { Service as HService } from "services/http"

export default class Service {
    private Http: HService | null = null

    constructor(http: HService) {
        this.Http = http
    }

    public async get() {
        return await this.Http?.instance.get(`/cases`);
    }

    public async getZReport(caseID: string) {
        return await this.Http?.instance.get(`report/z-report/${caseID}`);
    }
    
    public async create(data: any) {
        return await this.Http?.instance.post(`/cases`, data);
    }

    public async close() {
        return await this.Http?.instance.get(`/cases/close`);
    }
}