import GlobalStates from "config/global/states";
import Swal from "sweetalert2";
import Services from "../../../../services/index";
import PageOrder from "../../../../app/views/pages/orders";
import {PagePropCommonDocument} from "../../../../modules/views/pages/pageProps";
import Table from "../../../../app/views/pages/orders/check/components/table";

const SendOrder = (
    commonProp: PagePropCommonDocument,
    pageOrder: PageOrder,
    pageOrderTable?: Table
) => {
    if (pageOrder.state.newOrders.length === 0) {
        return;
    }
    let table = commonProp.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
    let orders = pageOrder.state.newOrders.map(product => ({
        product: product.productId,
        isFirst: pageOrderTable?.state.sendFirst.includes(product._id) ?? false,
        quantity: product.quantity,
        price: product.priceId,
        options: product.options ?? [],
        note: product.note
    }));

    if (GlobalStates.CustomerId) {
        let success = true;
        const ordersMap = {
            products: orders,
            user: GlobalStates.CustomerId,
            address: 0,
            courier: GlobalStates.SelectedCourierId ? GlobalStates.SelectedCourierId : "",
            defaultPaymentType: GlobalStates.SelectedPaymentTypeId
        };
        Services.Post.takeaway(ordersMap).then((resData) => {
            if (resData.status) {
                Swal.fire({
                    title: commonProp.router.t("order-created"),
                    icon: "success",
                    timer: 2000,
                }).then(() => {
                    commonProp.router.navigate("/", {replace: true})
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: commonProp.router.t("error-try-again"),
                });
                success = false;
            }
        })
        if (!success) return;
    } else {
        const ordersMap = orders;
        let params = {
            tableId: GlobalStates.SelectedTableId,
            products: ordersMap
        };

        ((table.orders.length > 0)
            ? Services.Put.orders(params)
            : Services.Post.order(params)).then(resData => {
            if (resData.status && Array.isArray(resData.data.orders)) {
                let tables = commonProp.getGlobalData.AllTables.map(table => {
                    if (table._id == params.tableId) {
                        table.updatedAt = new Date();
                        table.orders = resData.data.orders;
                        table.totalPrice = resData.data.totalPrice;
                    }
                    return table;
                })
                commonProp.setGlobalData({
                    AllTables: tables
                }, () => {
                    Swal.fire({
                        title: commonProp.router.t("order-created"),
                        icon: "success",
                        timer: 2000,
                    });
                    commonProp.router.navigate("/", {replace: true})
                })
            }
        });
    }
};

export default SendOrder;
