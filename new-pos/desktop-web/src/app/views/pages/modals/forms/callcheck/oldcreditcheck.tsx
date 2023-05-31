import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import {payment_types} from "constants/paymentTypes";
import Printer from "../../../../../../config/global/printers/index";
import "./oldcheck.css";
import Services from "services/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";

type PageState = {
    check: any;
};

type PageProps = {
    data: {
        checkId: string
        tickCustomerId: string
    };
} & PagePropCommonDocument;

class OldCreditCheck extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        const getOldCheck = Services.Get.checks({
            checkId: this.props.data.checkId,
        }).data;
        this.state = {
            check: getOldCheck,
        };
    }

    getTotalPayment() {
        let sum = 0;
        this.state.check?.payments.forEach((payment: any) =>
            payment.type == 14 ? undefined : (sum += payment.amount)
        );
        return sum;
    }

    getTotalOrders() {
        let sum = 0;
        this.state.check?.products.forEach((product: any) => (sum += product.price));
        return sum;
    }

    getProductCount() {
        let sum = 0;
        this.state.check?.products.forEach((product: any) => (sum += product.quantity));
        return sum;
    }

    print() {
        let printData: any = {
            orders: this.state.check?.products.map((product: any) => ({
                name: product.productName,
                quantity: product.quantity,
                price: product.price,
            })),

            total: this.state.check?.payments.map((payment: any) => ({
                currency: payment.currency,
                amount: payment.amount,
            })),

            payments: this.state.check?.payments.map((payment: any) => ({
                currency: payment.currency,
                amount: payment.amount,
                type: payment.type
            })),
        };

        let table = this.props.getGlobalData.AllTables.findSingle("_id", this.state.check.table)?.title;
        if (table) {
            let section = this.props.getGlobalData.Sections.findSingle("_id", table?.section)?.title;
            if (section) {
                printData = {
                    ...printData,
                    table: `${section} - ${table}`
                }
            }
        }

        Printer.All.printAll(printData);
    }

    render() {
        return (
            <>
                <div className="oldCheckContainer">
                    <table style={{width: "90%", border: "1px solid"}}>
                        <tr style={{width: "50%", background: "grey", color: "white"}}>
                            <th>{this.props.router.t("payment-status")}</th>
                            <th>{this.props.router.t("date")}</th>
                        </tr>
                        <tr style={{width: "50%"}}>
                            <th>
                                {this.state.check.is_it_paid
                                    ? this.props.router.t("paid")
                                    : "not-paid"}
                            </th>
                            <th>
                                {new Date(this.state.check.createdAt).toLocaleTimeString()}
                            </th>
                        </tr>
                    </table>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-evenly",
                            height: "33vh",
                        }}
                    >
                        <div>
                            <div style={{textAlign: "center"}}>
                                {" "}
                                <strong>{this.props.router.t("orders")}</strong>{" "}
                            </div>
                            <table
                                style={{width: "25vw", height: "15vh"}}
                                cellSpacing="0"
                                cellPadding="0"
                            >
                                <tr>
                                    <td>
                                        <table
                                            style={{width: "100%"}}
                                            cellSpacing="0"
                                            cellPadding="1"
                                        >
                                            <tr
                                                style={{
                                                    color: "white",
                                                    background: "chocolate",
                                                    height: "52px",
                                                }}
                                            >
                                                <th style={{width: "3vw"}}>
                                                    {this.props.router.t("number")}
                                                </th>
                                                <th style={{width: "19vw"}}>
                                                    {this.props.router.t("product-name")}
                                                </th>
                                                <th style={{width: "3vw"}}>
                                                    {this.props.router.t("price")}
                                                </th>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{height: "22vh", overflow: "auto"}}>
                                            <table cellSpacing="0" cellPadding="1">
                                                {this.state.check?.products.map((product: any) => (
                                                    <tr>
                                                        <th style={{width: "3vw"}}>{product.quantity}</th>
                                                        <th style={{width: "19vw"}}>
                                                            {product.productName}
                                                        </th>
                                                        <th style={{width: "3vw"}}>{product.price}</th>
                                                    </tr>
                                                ))}
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div>
                                <tr>
                                    <th style={{width: "5vw", border: "1px solid"}}>
                                        {this.props.router.t("total")}
                                    </th>
                                    <th style={{width: "15vw", border: "1px solid"}}>
                                        {this.getProductCount()}{" "}
                                        {this.props.router.t("number-product")}
                                    </th>
                                    <th style={{width: "5vw", border: "1px solid"}}>
                                        {this.getTotalOrders()} TL
                                    </th>
                                </tr>
                            </div>
                        </div>

                        <div style={{marginLeft: "2px"}}>
                            <div style={{textAlign: "center"}}>
                                {" "}
                                <strong>{this.props.router.t("payments")}</strong>{" "}
                            </div>
                            <table style={{width: "25vw"}} cellSpacing="0" cellPadding="0">
                                <tr>
                                    <td>
                                        <table
                                            style={{width: "100%"}}
                                            cellSpacing="0"
                                            cellPadding="1"
                                        >
                                            <tr style={{color: "white", background: "green"}}>
                                                <th style={{width: "7vw"}}>
                                                    {this.props.router.t("type")}
                                                </th>
                                                <th style={{width: "13vw"}}>
                                                    {this.props.router.t("quantity")}
                                                </th>
                                                <th style={{width: "5vw"}}>
                                                    {this.props.router.t("creation-date")}
                                                </th>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{height: "22vh", overflow: "auto"}}>
                                            <table cellSpacing="0" cellPadding="1">
                                                {this.state.check?.payments.map((payment: any) => (
                                                    <tr>
                                                        <th style={{width: "5vw"}}>
                                                            {payment_types[Number(payment.type) - 1]}
                                                        </th>
                                                        <th style={{width: "15vw"}}>
                                                            {payment.amount}
                                                            {payment.currency}
                                                        </th>
                                                        <th style={{width: "5vw"}}>
                                                            {new Date(payment.createdAt).toLocaleTimeString()}
                                                        </th>
                                                    </tr>
                                                ))}
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div>
                                <tr>
                                    <th style={{width: "5vw", border: "1px solid"}}>
                                        {this.props.router.t("total")}
                                    </th>
                                    <th style={{width: "15vw", border: "1px solid"}}>
                                        {this.state.check?.payments.length}{" "}
                                        {this.props.router.t("unit-payment")}
                                    </th>
                                    <th style={{width: "5vw", border: "1px solid"}}>
                                        {this.getTotalPayment()} TL
                                    </th>
                                </tr>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="changePriceButtons">
                    <button
                        style={{background: "blue"}}
                        onClick={() =>
                            this.props.openModal(MODAL.GET_CREDIT_CUSTOMER, {
                                tickCustomerId: this.props.data.tickCustomerId
                            })
                        }
                    >
                        {" "}
                        {this.props.router.t("back-to-list")}{" "}
                    </button>
                    <button
                        style={{background: "green"}}
                        onClick={() => this.print()}
                    >
                        {" "}
                        {this.props.router.t("print")}{" "}
                    </button>
                </div>
            </>
        );
    }
}

export default OldCreditCheck;
