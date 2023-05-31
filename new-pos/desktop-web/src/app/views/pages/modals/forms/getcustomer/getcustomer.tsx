import FuzzySearch from "fuzzy-search";
import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import Swal from "sweetalert2";
import "./getcustomer.css";
import {GlobalStates} from "config/global";
import Services from "../../../../../../services/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import PageOrder from "../../../orders";

type PageState = {
    phoneNum: string;
};

type PageProps = {
    data: {
        orders: any[]
        isRedirect: boolean
        willPayTotalPrice: number
        pageOrder: PageOrder
    }
} & PagePropCommonDocument;

class GetCustomer extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            phoneNum: ""
        };
    }

    //SORULACAK
    searchCustomer(event: any, type: string) {
        if (type == "phoneNum") {
            this.setState({
                phoneNum: event.target.value,
            });
        }
        const customerSearcher = new FuzzySearch(GlobalStates.Ticks, [type], {
            caseSensitive: false,
        });
        const result = customerSearcher.search(event.target.value.trim());
        GlobalStates.Ticks(result);
    }

    createcreditCustomer = () => {
        this.props.openModal(MODAL.CREATE_CREDIT_CUSTOMER)
    };

    handleClick(tick: any) {
        console.log(tick);
        let params = {
            tableId: GlobalStates.SelectedTableId,
            orders: this.props.data.orders,
            payments: [
                {
                    type: 6,
                    amount: this.props.data.willPayTotalPrice,
                    currency: "TL",
                    tickId: tick._id,
                },
            ]
        };
        if (tick.discount.length > 0) {
            params = Object.assign(params, {
                discount: [
                    {
                        type: tick.discount[0].type,
                        amount: tick.discount[0].price,
                    },
                ]
            })
        }

        Services.Post.checks(params).then(resData => {
            if (resData.status) {
                let tables = this.props.getGlobalData.AllTables.map(table => {
                    if (table._id == params.tableId) {
                        if (this.props.data.isRedirect) {
                            table.paid_orders = [];
                            table.payments = [];
                            table.orders = [];
                            table.cover = [];
                            table.discount = [];
                        } else {
                            table.paid_orders = table.paid_orders.concat(params.orders);
                            table.payments = table.payments.concat(params.payments);
                        }
                    }
                    return table;
                })
                this.props.setGlobalData({
                    AllTables: tables
                }, () => {
                    Swal.fire({
                        title: this.props.router.t("add-success"),
                        icon: "success",
                    });
                    this.props.closeModal();
                    if (this.props.data.isRedirect) {
                        this.props.router.navigate("/", {replace: true});
                    }
                })
            } else {
                Swal.fire({
                    title: this.props.router.t("error"),
                    icon: "error",
                });
            }
        })
    };

    render() {
        return (
            <div className="Home-tick">
                <div className="search-show-tick">
                    <div className="searchtick">
                        <table>
                            <thead>
                            <tr>
                                <th>{this.props.router.t("phone-number")}</th>
                                <th>{this.props.router.t("name")}</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {["phoneNum", "name"].map((type: string) => (
                                    <td>
                                        <input
                                            style={{color: "black", borderRadius: "16px"}}
                                            onChange={(event) => this.searchCustomer(event, type)}
                                        />
                                    </td>
                                ))}
                                <td className="customer-operations-tick">
                                    <button onClick={() => this.createcreditCustomer()}>
                                        {this.props.router.t("new-ticks-customer")}
                                    </button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="showtick">
                        <table>
                            <thead>
                            <tr>
                                <th style={{width: "17vw"}}>
                                    {this.props.router.t("phone-number")}
                                </th>
                                <th style={{width: "20vw"}}>
                                    {this.props.router.t("name")}
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.props.getGlobalData.Ticks &&
                                this.props.getGlobalData.Ticks.map((tick: any) => (
                                    <tr
                                        onClick={() => this.handleClick(tick)}
                                        style={{color: "black"}}
                                    >
                                        <th style={{width: "17vw"}}>{tick.phoneNum}</th>
                                        <th style={{width: "20vw"}}>{tick.name}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default GetCustomer;
