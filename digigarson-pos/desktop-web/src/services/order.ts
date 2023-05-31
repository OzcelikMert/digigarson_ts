import { Service as HService } from "services/http"

export default class Service {
    private Http: HService | null = null

    constructor(http: HService) {
        this.Http = http
    }

    public async get(id: string) {
        return await this.Http?.instance.get(`/orders/${id}`);
    }

    public async create(id: string, data: any) {
        return await this.Http?.instance.post(`/orders/${id}`, data);
    }

    public async update(id: string, data: any) {
        return await this.Http?.instance.put(`/orders/${id}`, data);
    }

    public async updateProduct(id: string, tableId: string, data: any) {
        return await this.Http?.instance.put(`/orders/${tableId}/${id}`, data);
    }

    public async deleteProduct(id: string, tableId: string) {
        return await this.Http?.instance.delete(`/orders/${tableId}/${id}`);
    }
    public async cover(tableId: string, data: any) {
        return await this.Http?.instance.post(`/orders/${tableId}/cover`, data);
    }
    public async discount(tableId: string, data: any) {
        return await this.Http?.instance.post(`/orders/${tableId}/discount`, data);
    }

    public async print(tableId: string) {
        return await this.Http?.instance.put(`/isprint/${tableId}`);
    }

    public async move(currentTable: string, targetTable: string, data: any) {
        return await this.Http?.instance.post(`/order/move/${currentTable}/${targetTable}`, data);
    }
}