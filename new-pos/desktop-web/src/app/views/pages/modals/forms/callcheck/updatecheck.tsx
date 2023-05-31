import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import {payment_types} from "constants/paymentTypes";
import Swal from "sweetalert2";
import Services from "services/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Functions from "../../../../../../config/global/functions/index";
import Callcheck from "./callcheck";
import {CheckPutParamDocument} from "../../../../../../modules/services/checks";

type PageState = {
    fetchComplete: boolean;
    payments: any[];
    products: any[];
};

type PageProps = {
    data: Callcheck;
} & PagePropCommonDocument;


class Updatecheck extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            fetchComplete: false,
            payments: [],
            products: [],
        };
    }

    componentDidMount() {
        this.sets();
    }

    formatPaymentsData(payments: any[]) {
        let data = Array();
        payments?.forEach((payment: any) =>
            data.push({payment: payment, uid: Functions.createUUID()})
        );
        return data;
    }

    sets() {
        const getOldCheck = Services.Get.checks({
            checkId: this.props.data.state.checkID
        }).data
        console.log(getOldCheck)
        const payments = getOldCheck.payments;
        const products = getOldCheck.products;

        this.setState({
            payments: payments,
            products: products
        })

    }

    getTotal() {
        let sum = 0;
        this.state.products.forEach(
            (product: any) => (sum += product.price)
        );
        return sum;
    }

    getTotalPayment(payment: any) {
        let sum = 0;
        payment.forEach((payment: any) =>
            payment.type == 14 ? undefined : (sum += payment.amount)
        );
        return sum;
    }

    save() {
        let data: CheckPutParamDocument = {
            checkId: this.props.data.state.checkID,
            payments: this.state.payments.map((row: any) => ({
                type: Number(row.type),
                amount: Number(row.amount),
                currency: row.currency,
                createdAt: new Date().toISOString(),
            })),
        };
        if (this.getTotal() < this.getTotalPayment(data.payments)) {
            Swal.fire({
                title: this.props.router.t("update-check"),
                icon: "error",
            });
        } else if (this.getTotal() > this.getTotalPayment(data.payments)) {
            Swal.fire({
                title: this.props.router.t("update-check-less"),
                icon: "error",
            });
        } else {
            Services.Put.checks(data).then(resData => {
                if (resData.status) {
                    Swal.fire({
                        title: this.props.router.t("updated-ticket"),
                        icon: "success",
                        timer: 2000,
                    }).then(() => {
                        this.cancel();
                    });
                } else {
                    Swal.fire({
                        title: this.props.router.t("error"),
                        icon: "error",
                    });
                }
            })
        }
    }

    cancel() {
        this.props.openModal(MODAL.CALL_CHECK);
    }

    deleteRow(uid: any) {
        this.setState({
            payments: this.state.payments.filter((row: any) => row.uid != uid),
        });
    }

    addRow() {
        this.setState({
            payments: [
                ...this.state.payments,
                {
                    payment: {
                        type: 1,
                        amount: 0,
                        currency: "TL",
                    },
                    uid: Functions.createUUID(),
                },
            ],
        });
    }

    handlePriceChange(value: any, uid: any) {
        let payment = this.state.payments.findSingle("_id", uid);
        payment.amount = value;
        this.setState({
            payments: this.state.payments,
        });
    };

    handleTypeChange(value: any, uid: any) {
        let payment = this.state.payments.findSingle("_id", uid);
        payment.type = value;
        this.setState({
            payments: this.state.payments,
        });
    };

    Payment = (props: any) => {
        return (
            <tr style={{width: "100%"}}>
                <td style={{width: "20vw", textAlign: "center"}}>
                    <select
                        onChange={(event) => this.handleTypeChange(event.target.value, props._id)}
                        defaultValue={props.type}
                    >
                        {
                            payment_types.map((payment_type: any, i: number) => (
                                <option value={i + 1}> {payment_type} </option>
                            ))
                        }
                    </select>
                </td>
                <td style={{width: "20vw", textAlign: "center"}}>
                    <input
                        min={0}
                        type={"number"}
                        defaultValue={props.amount}
                        onChange={(event) => this.handlePriceChange(event.target.value, props._id)}
                    />
                </td>
                <td style={{width: "10vw", textAlign: "center"}}>
                    {props.currency}
                </td>
                <td style={{width: "9vw", textAlign: "center"}}>
                    <button
                        onClick={() => this.deleteRow(props._id)}
                        className="btn btn-danger"
                    >
                        {this.props.router.t("delete")}
                    </button>
                </td>
            </tr>
        );
    }

    render() {
        return (
            <>
                <div className="oldCheckContainer no-overflow">
                    <table cellSpacing="0" cellPadding="0">
                        <thead>
                        <tr>
                            <td>
                                <table
                                    style={{width: "59vw"}}
                                    cellSpacing="0"
                                    cellPadding="1"
                                >
                                    <tr style={{color: "white", background: "grey"}}>
                                        <th style={{width: "20vw", textAlign: "center"}}>
                                            {this.props.router.t("type")}
                                        </th>
                                        <th style={{width: "20vw", textAlign: "center"}}>
                                            {this.props.router.t("amount")}
                                        </th>
                                        <th style={{width: "10vw", textAlign: "center"}}>
                                            {this.props.router.t("genus")}
                                        </th>
                                        <th style={{width: "9vw", textAlign: "center"}}>
                                            {this.props.router.t("action")}
                                        </th>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        </thead>
                        <tbody>
                        <div style={{height: "33vh", overflow: "auto"}}>
                            <table
                                style={{width: "59vw"}}
                                cellSpacing="0"
                                cellPadding="1"
                            >
                                {
                                    this.state.payments.map((payment: any) => (
                                        <this.Payment {...payment}/>
                                    ))
                                }
                                <tr>
                                    <th style={{width: "20vw", textAlign: "center"}}></th>
                                    <th style={{width: "20vw", textAlign: "center"}}>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => this.addRow()}
                                        >
                                            {this.props.router.t("add")}
                                        </button>
                                    </th>
                                    <th style={{width: "10vw", textAlign: "center"}}></th>
                                    <th style={{width: "9vw", textAlign: "center"}}></th>
                                </tr>
                            </table>
                        </div>
                        </tbody>
                    </table>
                </div>
                <div>
          <span style={{paddingLeft: 56, fontWeight: 600}}>
            {this.props.router.t("total-ticket-amount")}: {this.getTotal()}
          </span>
                </div>
                <div className="changePriceButtons">
                    <button style={{background: "green"}} onClick={() => this.save()}>
                        {" "}
                        {this.props.router.t("submit")}
                    </button>
                    <button onClick={() => this.cancel()}>
                        {this.props.router.t("cancel")}
                    </button>
                </div>
            </>
        );
    }
}

export default Updatecheck;
