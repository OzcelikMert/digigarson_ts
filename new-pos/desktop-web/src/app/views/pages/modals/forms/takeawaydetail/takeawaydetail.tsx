import {Component} from "react";
import "./takeawaydetail.css";
import {payment_types} from "constants/paymentTypes";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Printer from "../../../../../../config/global/printers/index";

type PageState = {};

type PageProps = {
    data: any;
} & PagePropCommonDocument;

class PageTakeAwayDetail extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    componentDidMount() {
        this.getTotalOrders();
        this.getProductCount();
        this.getTotalPayment();
    }

    getPhoneNumber(id: any) {
        return this.props.getGlobalData.AllCustomers.findSingle("id", id)?.gsm_no ?? "";
    }

    getTotalPayment() {
        let sum = 0;
        this.props.data.payments.forEach((payment: any) =>
            payment.type == 14 ? undefined : (sum += Number(payment.amount))
        );
        return sum;
    }

    getTotalOrders() {
        let sum = 0;
        this.props.data.products.forEach((product: any) => (sum += Number(product.price)));
        return sum;
    }

    getProductCount() {
        let sum = 0;
        this.props.data.products.forEach(
            (product: any) => (sum += Number(product.quantity))
        );
        return sum;
    }

    print() {
        let payments: any[] = [];
        let totalAmount = 0;
        this.props.data.products.forEach((order: any) => {
            totalAmount += Number(order.price)
        })

        if (this.props.data.payments.length > 0) {
            payments = this.props.data.payments.map((payment: any) => ({
                amount: payment.amount,
                currency: payment.currency,
                type: payment.type
            }));
        } else {
            payments.push({
                amount: totalAmount,
                currency: "TL",
                type: this.props.data.defaultPaymentType
            })
        }

        Printer.ProductsInOrder.printProductsInOrder({
                orders: this.props.data.products.map((order: any) => ({
                        name: order.productName,
                        price: order.price,
                        currency: "TL",
                        quantity: order.quantity
                    })
                ),
                total: {
                    amount: totalAmount,
                    currency: "TL"
                },
                payments: payments,
                name: this.props.data.customer.full_name,
                address: this.props.data.customer.address.address,
                phone: this.getPhoneNumber(this.props.data.customer.customer_id)
            }
        )
    }

    render() {
        return (
            <>
                <div className="oldTakeawayContainer">
                    <table style={{width: "90%", border: "1px solid"}}>
                        <tr style={{width: "50%", background: "grey", color: "white"}}>
                            <th>{this.props.router.t("user")}</th>
                            <th>{this.props.router.t("payment-status")}</th>
                            <th>{this.props.router.t("date")}</th>
                        </tr>
                        <tr style={{width: "50%"}}>
                            <th>{this.props.data.customer?.full_name}</th>
                            <th>
                                {this.props.data.is_it_paid
                                    ? this.props.router.t("paid")
                                    : this.props.router.t("not-paid")}
                            </th>
                            <th>{new Date(this.props.data.createdAt).toLocaleDateString()}</th>
                        </tr>
                    </table>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            height: "33vh",
                        }}
                    >
                        <div>
                            <div style={{textAlign: "center"}}>
                                {" "}
                                <strong>{this.props.router.t("orders")}</strong>{" "}
                            </div>
                            <table
                                style={{width: "61vw", height: "15vh"}}
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
                                                <th style={{width: "13vw"}}>
                                                    {this.props.router.t("number")}
                                                </th>
                                                <th style={{width: "35vw"}}>
                                                    {this.props.router.t("product-name")}
                                                </th>
                                                <th style={{width: "13vw"}}>
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
                                                {this.props.data.products?.map((product: any) => (
                                                    <tr>
                                                        <th style={{width: "13vw"}}>
                                                            {product.quantity}
                                                        </th>
                                                        <th style={{width: "35vw"}}>
                                                            {product.productName}
                                                        </th>
                                                        <th style={{width: "13vw"}}>{product.price}</th>
                                                    </tr>
                                                ))}
                                            </table>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            <div>
                                <tr>
                                    <th style={{width: "13vw", border: "1px solid"}}>
                                        {this.props.router.t("total")}
                                    </th>
                                    <th style={{width: "35vw", border: "1px solid"}}>
                                        {this.getProductCount()}{" "}
                                        {this.props.router.t("number-product")}
                                    </th>
                                    <th style={{width: "13vw", border: "1px solid"}}>
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
                            <table style={{width: "61vw"}} cellSpacing="0" cellPadding="0">
                                <tr>
                                    <td>
                                        <table
                                            style={{width: "100%"}}
                                            cellSpacing="0"
                                            cellPadding="1"
                                        >
                                            <tr style={{color: "white", background: "green"}}>
                                                <th style={{width: "13vw"}}>
                                                    {this.props.router.t("type")}
                                                </th>
                                                <th style={{width: "35vw"}}>
                                                    {this.props.router.t("quantity")}
                                                </th>
                                                <th style={{width: "13vw"}}>
                                                    {this.props.router.t("payment-date")}
                                                </th>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div style={{height: "22vh", overflow: "auto"}}>
                                            <table cellSpacing="0" cellPadding="1">
                                                {this.props.data.payments.map((payment: any) => (
                                                    <tr>
                                                        <th style={{width: "13vw"}}>
                                                            {payment_types[Number(payment.type) - 1]}
                                                        </th>
                                                        <th style={{width: "35vw"}}>
                                                            {payment.amount}
                                                            {payment.currency}
                                                        </th>
                                                        <th style={{width: "13vw"}}>
                                                            {new Date(
                                                                this.props.data.createdAt
                                                            ).toLocaleTimeString()}
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
                                    <th style={{width: "13vw", border: "1px solid"}}>
                                        {this.props.router.t("total")}
                                    </th>
                                    <th style={{width: "35vw", border: "1px solid"}}>
                                        {this.props.data.payments.length}{" "}
                                        {this.props.router.t("unit-payment")}
                                    </th>
                                    <th style={{width: "13vw", border: "1px solid"}}>
                                        {this.getTotalPayment()} TL
                                    </th>
                                </tr>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="changePriceButtons">
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

export default PageTakeAwayDetail;
