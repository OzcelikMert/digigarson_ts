import Api from "./api";
import {ServicePages} from "../public/ajax";
import {CourierDeleteParamDocument} from "../modules/services/couriers";
import {OrderDeleteParamDocument} from "../modules/services/orders";
import {CostDeleteParamDocument} from "../modules/services/cost";

const Delete = {
    couriers(params: CourierDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.couriers, params.courierId],
            data: params
        });
    },
    orders(params: OrderDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.orders, params.tableId, params.orderId],
            data: params
        });
    },
    cost(params: CostDeleteParamDocument) {
        return Api.delete({
            url: [ServicePages.costs, params.expenseId],
            data: params
        });
    },
}

export default Delete;

