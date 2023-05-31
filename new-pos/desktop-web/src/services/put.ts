import Api from "./api";
import {ServicePages} from "../public/ajax";
import {CasePutParamDocument} from "../modules/services/case";
import {CheckPutParamDocument} from "../modules/services/checks";
import {
    MoveOrderPutParamDocument,
    OrdersPutParamDocument,
    ProductOrderPutParamDocument
} from "../modules/services/orders";
import {PrintHomeDeliveryPutParamDocument, PrintOrderPutParamDocument} from "../modules/services/print";
import {TablePutParamDocument} from "../modules/services/tables";

const Put = {
    case(params: CasePutParamDocument) {
        let urlExt = (params.isClose) ? ["close"] : [];
        return Api.put({
            url: [ServicePages.case].concat(urlExt),
            data: params
        });
    },
    checks(params: CheckPutParamDocument) {
        return Api.put({
            url: [ServicePages.checks, "old", params.checkId],
            data: params
        });
    },
    orders(params: OrdersPutParamDocument) {
        return Api.put({
            url: [ServicePages.orders, params.tableId],
            data: params
        });
    },
    productOrders(params: ProductOrderPutParamDocument) {
        return Api.put({
            url: [ServicePages.orders, params.tableId, params.orderId],
            data: params
        });
    },
    orderPrint(params: PrintOrderPutParamDocument) {
        return Api.put({
            url: [ServicePages.print, params.tableId],
            data: params
        });
    },
    homeDeliveryPrint(params: PrintHomeDeliveryPutParamDocument) {
        return Api.put({
            url: [ServicePages.takeaway, params.checkId, ServicePages.print],
            data: params
        });
    },
    moveOrder(params: MoveOrderPutParamDocument) {
        return Api.put({
            url: [ServicePages.move, params.currentTable, params.targetTable],
            data: params
        });
    },
    table(params: TablePutParamDocument) {
        return Api.put({
            url: [ServicePages.tables, params.tableId],
            data: params
        });
    },
}

export default Put;

