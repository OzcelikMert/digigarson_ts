import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import {payment_types} from "constants/paymentTypes";
import "./oldcheck.css";
import Services from "../../../../../../services/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Callcheck from "./callcheck";

type PageState = {
    product: any;
    payment: any;
    oldcheck: any;
    discount: any;
    cover: any;
};

type PageProps = {
    data: Callcheck;
} & PagePropCommonDocument;

class OldCheck extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            product: [],
            payment: [],
            oldcheck: {},
            discount: [],
            cover: [],
        };
    }

    componentDidMount() {
        this.sets();
    }

    sets() {
        const getOldCheck = Services.Get.checks({
            checkId: this.props.data.state.checkID,
        }).data;

        const payments = getOldCheck.payments;
        const products = getOldCheck.products;
        const discounts = getOldCheck.discount;
        const covers = getOldCheck.cover;
        const getoldCheckData = getOldCheck;

        this.setState({
            product: products,
            payment: payments,
            oldcheck: getoldCheckData,
            discount: discounts,
            cover: covers
        });
    }

    getTotalPayment() {
        let sum = 0;
        this.state.payment.forEach((payment: any) =>
            payment.type == 14 ? undefined : (sum += payment.amount)
        );
        return sum;
    }

    getTotalOrders() {
        let sum = 0;
        this.state.product.forEach((product: any) => (sum += product.price));
        return sum;
    }

    getProductCount() {
        let sum = 0;
        this.state.product.forEach((product: any) => (sum += product.quantity));
        return sum;
    }

    render() {
        console.log(this.state)
        return (
            <>
                <div className="oldCheckContainer">
                    <table style={{width: "90%", border: "1px solid"}}>
                        <tr style={{width: "50%", background: "grey", color: "white"}}>
                            <th>{this.props.router.t("user")}</th>
                            <th>{this.props.router.t("table")}</th>
                            <th>{this.props.router.t("payment-status")}</th>
                            <th>{this.props.router.t("date")}</th>
                        </tr>
                        <tr style={{width: "50%"}}>
                            <th>{this.props.data.state.oldCheckUser}</th>
                            <th>{this.props.data.state.table.title}</th>
                            <th>
                                {this.state.oldcheck.is_it_paid
                                    ? this.props.router.t("paid")
                                    : this.props.router.t("not-paid")}
                            </th>
                            <th>
                                {new Date(this.state.oldcheck.createdAt).toLocaleTimeString()}
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
                                            <tr style={{color: "white", background: "chocolate"}}>
                                                <th style={{width: "3vw", height: "4vw"}}>
                                                    {this.props.router.t("number")}
                                                </th>
                                                <th style={{width: "19vw", height: "4vw"}}>
                                                    {this.props.router.t("product-name")}
                                                </th>
                                                <th style={{width: "3vw", height: "4vw"}}>
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
                                                {this.state.product?.map((product: any) => (
                                                    <tr>
                                                        <th style={{width: "3vw"}}>{product.quantity}</th>
                                                        <th style={{width: "19vw"}}>
                                                            {product.productName}
                                                        </th>
                                                        <th style={{width: "3vw"}}>{product.price}</th>
                                                    </tr>
                                                ))}
                                                {
                                                        this.state.cover ? 
                                                            this.state.cover.map((cover: any) => (
                                                                <tr>
                                                                    <th>
                                                                        {cover.quantity}
                                                                    </th>
                                                                    <th>
                                                                        {cover.title}
                                                                    </th>
                                                                    <th>
                                                                        {cover.price} 
                                                                    </th>
                                                                </tr>
                                                            ))
                                                        :""
                                                    }  
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
                                                {this.state.payment?.map((payment: any) => (
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
                                                {
                                                        this.state.discount ? 
                                                            this.state.discount.map((discount: any) => (
                                                                <tr>
                                                                    <th>
                                                                        {discount.note}
                                                                    </th>
                                                                    <th>
                                                                        {discount.amount} TL
                                                                    </th>
                                                                </tr>                                                                
                                                            ))
                                                        :""
                                                    }                                          
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
                                        {this.state.payment.length}{" "}
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
                        onClick={() => this.props.openModal(MODAL.CALL_CHECK)}
                    >
                        {" "}
                        {this.props.router.t("back-tickets")}{" "}
                    </button>
                    <button
                        style={{background: "green"}}
                        onClick={() =>
                            this.props.openModal(
                                MODAL.UPDATE_OLD_CHECK,
                                this.props.data
                            )
                        }
                    >
                        {" "}
                        {this.props.router.t("update-tickets")}{" "}
                    </button>
                </div>
            </>
        );
    }
}

export default OldCheck;
