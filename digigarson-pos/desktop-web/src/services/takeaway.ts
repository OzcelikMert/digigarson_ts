import { Service as HService } from "services/http"

export default class Service {
    private Http: HService | null = null

    constructor(http: HService) {
        this.Http = http
    }

    public async get() {
        return await this.Http?.instance.get(`/home-delivery`);
    }

    public async getByInterval(start: any, end: any) {
        return await this.Http?.instance.get(`/home-delivery?_start=${start}&_end=5&is_it_paid=${end}`);
    }

    public async create(data:any) {
        return await this.Http?.instance.post(`/home-delivery`,data);
    }

    public async pay(id: any, data: any) {
        return await this.Http?.instance.post(`/home-delivery/${id}/pay`, data);
    }
}