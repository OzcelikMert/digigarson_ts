import Api from "./api";
import {ErrorCodes, Result, ServicePages} from "../public/ajax";
import {CaseGetParamDocument} from "../modules/services/case";
import V from "../library/variable";
import {CheckGetParamDocument} from "../modules/services/checks";
import {ProductGetParamDocument} from "../modules/services/product";
import {SectionGetParamDocument} from "../modules/services/sections";
import {TableGetParamDocument} from "../modules/services/tables";
import {TickGetParamDocument} from "../modules/services/tick";
import {OrderGetParamDocument} from "../modules/services/orders";

const Get = {
    case(params: CaseGetParamDocument) {
        let servicePage = (V.isEmpty(params.caseId)) ? [ServicePages.case] : [ServicePages.report, params.caseId];
        return Api.getSync({
            url: servicePage,
            data: params
        });
    },
    closeCase() {
        return Api.getSync({
            url: [ServicePages.case, "close"]
        })
    },
    categories() {
        return Api.getSync({
            url: [ServicePages.categories]
        });
    },
    checks(params: CheckGetParamDocument) {
        let url = params.checkId ? ["old", params.checkId] : [];
        return Api.getSync({
            url: [ServicePages.checks].concat(url),
            data: params
        });
    },
    costs() {
        return Api.getSync({
            url: [ServicePages.costs]
        });
    },
    couriers() {
        return Api.getSync({
            url: [ServicePages.couriers]
        });
    },
    customers() {
        return Api.getSync({
            url: [ServicePages.customers]
        });
    },
    order(params: OrderGetParamDocument) {
        return Api.getSync({
            url: [ServicePages.orders, params.tableId],
            data: params
        });
    },
    allProduct() {
        return Api.getSync({
            url: [ServicePages.products]
        });
    },
    productById(params: ProductGetParamDocument) {
        return Api.getSync({
            url: [ServicePages.products, params.productId],
            data: params
        });
    },
    allSection() {
        return Api.getSync({
            url: [ServicePages.section]
        });
    },
    sectionById(params: SectionGetParamDocument) {
        return Api.getSync({
            url: [ServicePages.section, params.sectionId],
            data: params
        });
    },
    allTables() {
        return Api.get({
            url: [ServicePages.tables]
        });
    },
    allTablesSync() {
        return Api.getSync({
            url: [ServicePages.tables]
        });
    },
    tableById(params: TableGetParamDocument) {
        return Api.getSync({
            url: [ServicePages.tables, params.tableId],
            data: params
        });
    },
    takeaway() {
        return Api.get({
            url: [ServicePages.takeaway]
        });
    },
    takeawaySync() {
        return Api.getSync({
            url: [ServicePages.takeaway]
        });
    },
    tick(params: TickGetParamDocument) {
        return Api.getSync({
            url: [ServicePages.tick, params.tickCustomerId],
            data: params
        });
    },
    myBranch() {
        return Api.getSync({
            url: [ServicePages.myBranch]
        });
    },
}

export default Get;

