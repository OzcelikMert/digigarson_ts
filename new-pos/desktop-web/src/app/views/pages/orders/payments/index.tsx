import React, {Component} from "react";
import "./index.css";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import PageOrder from "../index";
import {GlobalStates} from "../../../../../config/global";

type PageState = {};

type PageProps = {
    pageOrder: PageOrder
} & PagePropCommonDocument;

class Payments extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    handleClick(payment: any) {
        GlobalStates.SelectedPaymentTypeId = payment;
        this.props.pageOrder.setState({
            isSelectPayment: false,
            isSelectCourier: true
        })
    }

    render() {
        return (
            <div className="paymentsContainer">
                <article onClick={() => this.handleClick(2)}>
                    {this.props.router.t("cash")}
                </article>
                <article onClick={() => this.handleClick(1)}>
                    {this.props.router.t("credit-card")}
                </article>
                <article onClick={() => this.handleClick(11)}>SetCard</article>
                <article onClick={() => this.handleClick(7)}>Sodexo</article>
                <article onClick={() => this.handleClick(10)}>Multinet</article>
                <article onClick={() => this.handleClick(8)}>Smart</article>
                <article onClick={() => this.handleClick(12)}>Metropol</article>
            </div>
        );
    }
}

export default Payments;
