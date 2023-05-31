import GlobalStates from "config/global/states";
import Services from "../../../../services/index";
import Swal from "sweetalert2";
import {PagePropCommonDocument} from "../../../../modules/views/pages/pageProps";
import PageOrder, {PageOrderState} from "../../../../app/views/pages/orders";
import Table from "../../../../app/views/pages/orders/check/components/table";
import clone from "clone";
import Thread from "../../../../library/thread";

const deleteProduct = (
    commonProp: PagePropCommonDocument,
    pageOrder: PageOrder,
    pageOrderTable: Table
) => {
    let table = commonProp.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);

    Swal.fire({
        title: commonProp.router.t("delete-question"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: commonProp.router.t("cancel"),
        confirmButtonText: commonProp.router.t("yes"),
    }).then((result) => {
        if (result.isConfirmed) {
            let orders = clone(table.orders.findMulti("_id", pageOrderTable.state.selectedProductId));
            let newOrders = clone(pageOrder.state.newOrders.findMulti("_id", pageOrderTable.state.selectedProductId));

            Swal.fire({
                title: commonProp.router.t("pleaseWait").toCapitalizeCase(),
                html: commonProp.router.t("uploading") + "...",
                showConfirmButton: false,
                showCancelButton: false,
                allowOutsideClick: false,
                willOpen(popup: HTMLElement) {
                    Swal.showLoading()
                }
            });

            new Promise<any[]>(async resolve => {
                let deleted = [];

                newOrders.forEach(newOrder => {
                    deleted.push(newOrder);
                })

                for (let i = 0; i < orders.length; i++) {
                    let order = orders[i];
                    let resData = await Services.Delete.orders({
                        orderId: order._id,
                        tableId: GlobalStates.SelectedTableId,
                    });
                    if (resData.status) {
                        deleted.push(order)
                    }
                    await Thread.sleep(2);
                }

                resolve(deleted);
            }).then(result => {
                let tables = commonProp.getGlobalData.AllTables.map(table => {
                    if (table._id == GlobalStates.SelectedTableId) {
                        table.orders.map((order: any) => {
                            if (result.indexOfKey("_id", order._id) > -1) {
                                order.isDeleted = true;
                            }
                            return order;
                        });
                    }
                    return table;
                })
                commonProp.setGlobalData({
                    AllTables: tables
                })

                pageOrder.setState((state: PageOrderState) => {
                    return {
                        newOrders: state.newOrders.filter((order: any) => result.indexOfKey("_id", order._id) < 0)
                    };
                })

                Swal.fire(
                    commonProp.router.t("delete-selected-products"),
                    result.map(order => `<b>${order.quantity}x ${commonProp.router.t("product-delete")}</b>: ${order.productName}`).join("<br>"),
                    "success"
                );
            })
        }
    });
};

export default deleteProduct;
