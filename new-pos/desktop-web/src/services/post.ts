import Api from "./api";
import {ServicePages} from "../public/ajax";
import {CustomerPostParamDocument} from "../modules/services/customers";
import {TransferTableGetParamDocument} from "../modules/services/tables";
import {
    TakeawayPayParamDocument,
    TakeawayPostParamDocument,
} from "../modules/services/takeaway";
import {SignInPostParamDocument} from "../modules/services/signIn";
import {CasePostParamDocument} from "../modules/services/case";
import {CheckPostParamDocument} from "../modules/services/checks";
import {CostPostParamDocument} from "../modules/services/cost";
import {CourierPostParamDocument} from "../modules/services/couriers";
import {OrderPostParamDocument} from "../modules/services/orders";
import {CoverPostParamDocument} from "../modules/services/cover";
import {DiscountPostParamDocument} from "../modules/services/discount";
import {TickPostParamDocument} from "../modules/services/tick";

const Post = {
    case(params: CasePostParamDocument) {
        return Api.post({
            url: [ServicePages.case],
            data: params
        });
    },
    checks(params: CheckPostParamDocument) {
        return Api.post({
            url: [ServicePages.checks, params.tableId, "pay"],
            data: params
        });
    },
    costs(params: CostPostParamDocument) {
        return Api.post({
            url: [ServicePages.costs],
            data: params
        });
    },
    couriers(params: CourierPostParamDocument) {
        return Api.post({
            url: [ServicePages.couriers],
            data: params
        });
    },
    customers(params: CustomerPostParamDocument) {
        return Api.post({
            url: [ServicePages.customers],
            data: params
        });
    },
    order(params: OrderPostParamDocument) {
        return Api.post({
            url: [ServicePages.orders, params.tableId],
            data: params
        });
    },
    cover(params: CoverPostParamDocument) {
        return Api.post({
            url: [ServicePages.orders, params.tableId, "cover"],
            data: params
        });
    },
    discount(params: DiscountPostParamDocument) {
        return Api.post({
            url: [ServicePages.orders, params.tableId, "discount"],
            data: params
        });
    },
    transferTable(params: TransferTableGetParamDocument) {
        return Api.post({
            url: [ServicePages.orders, "transfer"],
            data: params
        });
    },
    takeaway(params: TakeawayPostParamDocument) {
        return Api.post({
            url: [ServicePages.takeaway],
            data: params
        });
    },
    payTakeaway(params: TakeawayPayParamDocument) {
        return Api.post({
            url: [ServicePages.takeaway, params.id, "pay"],
            data: params
        });
    },
    tick(params: TickPostParamDocument) {
        return Api.post({
            url: [ServicePages.tick],
            data: params
        });
    },
    signIn(params: SignInPostParamDocument) {
        return Api.post({
            url: [ServicePages.signIn],
            data: params
        });
    },
};

export default Post;
