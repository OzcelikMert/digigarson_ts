import {Component} from "react";
import {payment_types} from "constants/paymentTypes";
import "./findadition.css";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {MODAL} from "constants/modalTypes";

interface ISearchParameters {
    paidStatus: number;
}

type PageProps = {
    data: any;
} & PagePropCommonDocument;

type PageState = {
    searchParams: ISearchParameters;
    searchTakeaway: any;
    takeAway: any[];
};

class Findadition extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    state = {
        takeAway: [],
        searchParams: {
            paidStatus: -1,
        },
        searchTakeaway: [],
    };
    sum = 0;

    componentDidMount() {
        this.sets();
    }

    sets() {
        this.setState(
            (state: PageState) => {
                state.takeAway = [];

                this.props.getGlobalData.AllTakeaway.forEach(
                    (takeaway: any) => {
                        let customer =
                            this.props.getGlobalData.AllCustomers.findSingle(
                                "id",
                                takeaway.customer.customer_id
                            );
                        state.takeAway.push({...takeaway, gsm_no: customer.gsm_no});
                    }
                );

                state.searchTakeaway = state.takeAway;
                return state;
            },
            () => {
                this.filter();
            }
        );
    }

    filter() {
        this.setState((state: PageState) => {
            state.searchTakeaway = state.takeAway.filter(
                (takeAway) =>
                    state.searchParams.paidStatus == -1 ||
                    takeAway.is_it_paid == state.searchParams.paidStatus
            );
            return state;
        });
    }

    searchParameters(data: any) {
        this.setState(
            (state: PageState) => {
                state.searchParams = Object.assign(state.searchParams, data);
                return state;
            },
            () => {
                this.filter();
            }
        );
    }

    render() {
        console.log(this.state.searchParams.paidStatus);
        return (
            <>
                <div className="takeaway-headers">
                    <div className="left" style={{width: "100%"}}>
                        <div className="search">
                            <table style={{width: "100%"}}>
                                <thead>
                                <tr>
                                    <th>{this.props.router.t("payment-status")}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>
                                        <select
                                            defaultValue={-1}
                                            style={{color: "black", width: "100%"}}
                                            onChange={(event: any) =>
                                                this.searchParameters({
                                                    ...this.state.searchParams,
                                                    paidStatus: Number(event.target.value),
                                                })
                                            }
                                        >
                                            <option value={-1}>{this.props.router.t("all")}</option>
                                            <option value={1}>{this.props.router.t("paid")}</option>
                                            <option value={0}>
                                                {this.props.router.t("not-paid")}
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="takeaway-bodys">
                    <table>
                        <thead>
                        <tr>
                            <th>{this.props.router.t("phone-number")}</th>
                            <th>{this.props.router.t("name")}</th>
                            <th>{this.props.router.t("address-title")}</th>
                            <th>{this.props.router.t("creation-date")}</th>
                            <th>{this.props.router.t("paid")}</th>
                            <th>{this.props.router.t("payment-type")}</th>
                            <th>{this.props.router.t("detail")}</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.searchTakeaway
                            .filter((customerData: any) => {
                                if (
                                    customerData.customer.customer_id ==
                                    this.props.data.state.customerId
                                ) {
                                    return customerData;
                                }
                            })
                            ?.map((data: any) => {
                                return (
                                    <tr style={{cursor: "pointer", textAlign: "center"}}>
                                        <th>{data.gsm_no}</th>
                                        <th>{data.customer.full_name}</th>
                                        <th>{data.customer.address.title}</th>
                                        <th>
                                            {new Date(data.createdAt).toLocaleDateString("en-CA")}{" "}
                                            {new Date(data.createdAt).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "numeric",
                                                hour12: false,
                                            })}
                                        </th>
                                        <th
                                            style={{
                                                backgroundColor: data.is_it_paid ? "green" : "red",
                                            }}
                                        >
                                            {data.is_it_paid
                                                ? this.props.router.t("yes")
                                                : this.props.router.t("no")}
                                        </th>
                                        <th>
                                            {
                                                data.payments[0]?.type
                                                ? payment_types[Number(data.payments[0]?.type) - 1]
                                                : payment_types[Number(data.defaultPaymentType) - 1]
                                            }
                                        </th>
                                        <th>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    this.props.openModal(
                                                        MODAL.TAKEAWAY_DETAIL,
                                                        data
                                                    )
                                                }
                                            >
                                                {this.props.router.t("detail")}
                                            </button>
                                        </th>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

export default Findadition;
