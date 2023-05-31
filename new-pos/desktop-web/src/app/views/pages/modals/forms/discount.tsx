import React, {Component,} from "react";
import "./discount.css";
import Swal from "sweetalert2";
import {GlobalStates} from "config/global";
import Services from "../../../../../services/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import PageOrder, {PageOrderState} from "../../orders";
import Variable from "../../../../../library/variable";
import clone from "clone";

type PageState = {
    type: string;
    discountAmount: number;
    note: string
};

type PageProps = {
    data: PageOrder
} & PagePropCommonDocument;

class Discount extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            type: "percent",
            discountAmount: 0,
            note: ""
        };
    }

    handleAddDiscount = () => {
        if (Variable.isEmpty(this.state.note)) {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("noteRequired"),
            });
        }
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        const data = {
            tableId: GlobalStates.SelectedTableId,
            type: this.state.type === "percent" ? 0 : 1,
            amount: this.state.discountAmount,
            note: this.state.note
        };

        if (GlobalStates.CurrentTable.isSafeSales) {
            this.props.data.setState((state: PageOrderState) => {
                let type = this.state.type === "percent" ? 0 : 1;
                let total = Number(state.totalAmount)
                let discounts = clone(state.newDiscounts);
                let discountAmount = type === 0 ? ((total * this.state.discountAmount) / 100) : this.state.discountAmount
                discounts.push({
                    type: 1,
                    amount: discountAmount,
                    note: this.state.note
                });
                return {
                    totalAmount: state.totalAmount - discountAmount,
                    newDiscounts: discounts
                };
            })
            this.props.closeModal();
            Swal.fire({
                title: this.props.router.t("discount-success"),
                icon: "success",
            });
        } else {
            Services.Post.discount(data).then(resData => {
                if (resData.status) {
                    let tables = this.props.getGlobalData.AllTables?.map(table => {
                        if (table._id == GlobalStates.SelectedTableId) {
                            let type = this.state.type === "percent" ? 0 : 1;
                            let total = Number(table.totalPrice);
                            let discountAmount = type === 0 ? ((total * this.state.discountAmount) / 100) : this.state.discountAmount
                            table.discount = [...table.discount, {
                                type: 1,
                                amount: discountAmount,
                                note: this.state.note
                            }];
                            table.totalPrice = total - discountAmount;
                        }
                        return table;
                    })
                    this.props.setGlobalData({
                        AllTables: tables
                    })
                    this.props.closeModal();
                    Swal.fire({
                        title: this.props.router.t("discount-success"),
                        icon: "success",
                    });
                }
            });
        }
    };

    render(): React.ReactNode {
        return (
            <div className="discount">
                <div className="descriptionTitle">
                    {" "}
                    {this.props.router.t("description")}:{" "}
                </div>
                <div className="discountDescription">
                    <input
                        style={{color: "black"}}
                        onChange={(event) =>
                            this.setState({
                                note: event.target.value,
                            })
                        }
                        type="text"
                    />
                </div>
                <div className="descriptionTitle">
                    {" "}
                    {this.props.router.t("discount-rate")}:{" "}
                </div>
                <div className="discountAmount">
                    <input
                        onChange={(e) =>
                            this.setState({
                                discountAmount: Number(e.target.value),
                            })
                        }
                        type="number"
                        className="amount"
                        defaultValue={this.state.discountAmount}
                    />
                    <div className="percent">
                        <div
                            style={{
                                backgroundColor:
                                    this.state.type === "percent" ? "red" : "rgb(70, 0, 0)",
                            }}
                            onClick={() =>
                                this.setState({
                                    type: "percent",
                                })
                            }
                            className="percent"
                        >
                            %
                        </div>
                        <div
                            style={{
                                fontSize: "1.05vw",
                                backgroundColor:
                                    this.state.type === "amount" ? "red" : "rgb(70, 0, 0)",
                                wordWrap: "break-word",
                                whiteSpace: "nowrap",
                                wordBreak: "break-word",
                            }}
                            onClick={() =>
                                this.setState({
                                    type: "amount",
                                })
                            }
                            className="amount"
                        >
                            Miktar
                        </div>
                    </div>
                </div>
                <div
                    onClick={() => this.handleAddDiscount()}
                    className="submitDiscount"
                >
                    {this.props.router.t("submit")}
                </div>
            </div>
        );
    }
}

export default Discount;
