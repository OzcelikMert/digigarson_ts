import GlobalStates from "config/global/states";
import Swal from "sweetalert2";
import Printer from "../../printers/index";
import Functions from "../index";
import {MODAL} from "../../../../constants/modalTypes";
import PageOrder, {PageOrderState} from "../../../../app/views/pages/orders";
import clone from "clone";
import Table, {TableState} from "../../../../app/views/pages/orders/check/components/table";
import {PagePropCommonDocument} from "../../../../modules/views/pages/pageProps";
import Services from "services/index";

const handleClick = (
    functionName: string,
    commonProp: PagePropCommonDocument,
    pageOrder: PageOrder,
    pageOrderTable: Table
) => {
    GlobalStates.Type = functionName;
    let table = commonProp.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);

    switch (functionName) {
        case "deleteProduct":
            if (pageOrderTable.state.selectedProductId.length === 0) {
                Swal.fire({
                    title: commonProp.router.t("select-delete"),
                    icon: "warning",
                });
                return;
            }
            Functions.deleteProduct(
                commonProp,
                pageOrder,
                pageOrderTable
            );
            break;
        case "checkout":
            if (!GlobalStates.CurrentTable.isSafeSales) {
                if (table.orders.length > 0) {
                    commonProp.openModal(MODAL.CHECKOUT, pageOrder);
                } else {
                    Swal.fire({
                        icon: "error",
                        title: commonProp.router.t("nopayment-closed-table"),
                    });
                    return;
                }
            } else {
                if (pageOrder.state.newOrders.length > 0) {
                    commonProp.openModal(MODAL.CHECKOUT, {
                        pageOrder: pageOrder,
                        pageOrderTable: pageOrderTable
                    });
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: commonProp.router.t("please-add-product"),
                    });
                }
            }
            break;
        case "moveTable":
            if (GlobalStates.CurrentTable?.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                if (table.orders.length > 0) {
                    GlobalStates.ProductsToBeMoving = GlobalStates.CurrentTable.orders;
                    GlobalStates.Type = "moveProduct";
                    commonProp.router.navigate("/", {replace: true});
                } else {
                    // Please add any product
                }
            }
            break;
        case "splitProducts":
            if (GlobalStates.CurrentTable?.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                Functions.splitProducts();
            }
            break;
        case "moveProduct":
            if (GlobalStates.CurrentTable?.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                if (pageOrderTable.state.selectedProductId.length > 0) {
                    let orders: any[] = [];
                    GlobalStates.CurrentTable.orders.forEach((order: any) => {
                        if (pageOrderTable.state.selectedProductId.includes(order._id)) {
                            orders.push(order);
                        }
                    })
                    GlobalStates.ProductsToBeMoving = orders;
                    commonProp.router.navigate("/", {replace: true});
                    //Functions.moveProduct(router, products, selectedProductId || [], tableid);
                } else {
                    // Please select any product
                }
            }
            break;
        case "mergeCheck":
            if (GlobalStates.CurrentTable.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                Functions.mergeCheck();
            }
            break;
        case "sendOrder":
            if (GlobalStates.CurrentTable?.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                if (pageOrder.state.newOrders.length < 1) {
                    Swal.fire({
                        title: commonProp.router.t("please-add-product"),
                        icon: "warning",
                    });
                    return;
                }
                Functions.SendOrder(
                    commonProp,
                    pageOrder,
                    pageOrderTable
                );
            }
            break;
        case "nameTable":
            //FIXME: Backendi yok
            Functions.nameTable();
            Functions.inactiveButton(commonProp.router.t);
            break;
        case "changePrice":
            if (pageOrderTable.state.selectedProductId.length === 0) {
                Swal.fire({
                    title: commonProp.router.t("select-change"),
                    icon: "error",
                });
                return;
            }
            commonProp.openModal(MODAL.CHANGE_PRICE, pageOrderTable.state.selectedProductId)
            break;
        case "discount":
            if (Functions.checkPerm("505")) {
                commonProp.openModal(MODAL.DISCOUNT, pageOrder);
            } else {
                Swal.fire({
                    icon: "error",
                    title: commonProp.router.t("not-permission"),
                });
            }
            break;
        case "cover":
            if (Functions.checkPerm("506")) {
                commonProp.openModal(MODAL.COVER);
            } else {
                Swal.fire({
                    icon: "error",
                    title: commonProp.router.t("not-permission"),
                });
            }
            break;
        case "catering":
            //TODO: ikram
            Functions.inactiveButton(commonProp.router.t);
            Functions.catering();
            break;
        case "readbarcode":
            //TODO: bekleyebilir
            Functions.inactiveButton(commonProp.router.t);
            Functions.readbarcode();
            break;
        case "fastcheckout":
            GlobalStates.isFastPayment = true;
            handleClick(
                "checkout",
                commonProp,
                pageOrder,
                pageOrderTable
            )
            break;
        case "print":
            if (GlobalStates.CurrentTable?.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                if (table.orders.length > 0) {
                    Swal.fire({
                        icon: "question",
                        title: commonProp.router.t("not-print-question"),
                        showCancelButton: true,
                    }).then((result: any) => {
                        if (result.isConfirmed) {
                            Services.Put.table({
                                tableId: GlobalStates.SelectedTableId,
                                isPrint: {status: true}
                            }).then(resData => {
                                let printData = {
                                    discount: table.discount,
                                    cover: GlobalStates.CurrentTable.cover,
                                    orders: table.orders.map(
                                        (order: any) => ({
                                            id: order.product._id,
                                            name: order.product.title,
                                            price: order.product.prices[order.priceIndex].price,
                                            currency: order.product.prices[order.priceIndex].currency,
                                            quantity: order.product.prices[order.priceIndex].amount,
                                            category: order.product.category,
                                        })
                                    ),
                                    total: {
                                        amount: table.totalPrice,
                                        currency: "TL"
                                    }
                                };

                                let sectionTitle = commonProp.getGlobalData.Sections.findSingle("_id", GlobalStates.CurrentTable.section)?.title
                                printData = Object.assign(printData, {
                                    table: `${sectionTitle} - ${GlobalStates.CurrentTable.title}`
                                });

                                Printer.ProductsInOrder.printProductsInOrder(printData);
                                Swal.fire({
                                    title: commonProp.router.t("print-product-success"),
                                    icon: "success",
                                });
                            });
                        }
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: commonProp.router.t("error"),
                    });
                }
            }

            break;
        case "sendfirst":
            if (GlobalStates.CurrentTable?.isSafeSales) {
                Functions.inactiveButton(commonProp.router.t);
            } else {
                if (pageOrder.state.newOrders.length > 0) {
                    pageOrderTable.setState((state: TableState) => {
                        state.sendFirst = clone(pageOrderTable.state.selectedProductId);
                        return state;
                    })
                }
            }
            break;
        default:
            Functions.inactiveButton(commonProp.router.t);
            break;
    }
};

export default handleClick;
