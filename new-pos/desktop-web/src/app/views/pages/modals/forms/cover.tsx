import React, {Component} from "react";
import "./cover.css";
import Swal from "sweetalert2";
import {GlobalStates} from "config/global";
import Services from "../../../../../services/index";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import PageOrder from "../../orders";

type PageState = {
    price: number;
    quantity: number;
    title: string;
};

type PageProps = {
    data: PageOrder
} & PagePropCommonDocument;

class Cover extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            price: 0,
            quantity: 0,
            title: "",
        };
    }

    handleAddCover(): void {
        const data = {
            tableId: GlobalStates.SelectedTableId,
            price: Number(this.state.price) * Number(this.state.quantity),
            quantity: this.state.quantity,
            title: this.state.title,
        };
        Services.Post.cover(data).then(resData => {
            if (resData.status) {
                let tables = this.props.getGlobalData.AllTables?.map(table => {
                    if (table._id == GlobalStates.SelectedTableId) {
                        table.cover = [...table.cover, {
                            price: data.price,
                            quantity: data.quantity,
                            title: data.title
                        }]
                        table.totalPrice += data.price;
                    }
                    return table;
                })
                this.props.setGlobalData({
                    AllTables: tables
                })
                this.props.closeModal();
                Swal.fire({
                    title: "Kuver eklendi",
                    icon: "success",
                });
            }
        });
    }

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
                                title: event.target.value,
                            })
                        }
                        type="text"
                    />
                </div>
                <div className="descriptionTitle">
                    {this.props.router.t("cover-amount")}:{" "}
                </div>

                <div className="discountAmount">
                    <input
                        type="number"
                        className="amount"
                        onChange={(event) =>
                            this.setState({
                                price: Number(event.target.value),
                            })
                        }
                        defaultValue={this.state.price}
                    />
                    <div className="percent">
                        <div className="percent">TL</div>
                    </div>
                </div>

                <div className="discountAmount">
                    <input
                        type="number"
                        className="amount"
                        onChange={(event) =>
                            this.setState({
                                quantity: Number(event.target.value),
                            })
                        }
                        defaultValue={this.state.quantity}
                    />
                    <div className="percent">
                        <div className="percent">{this.props.router.t("item-number")}</div>
                    </div>
                </div>

                <div className="descriptionTitle">
                    {this.props.router.t("total-coverage-amount")}: {this.state.quantity * this.state.price} TL
                </div>

                <div onClick={() => this.handleAddCover()} className="submitDiscount">
                    {this.props.router.t("submit")}
                </div>
            </div>
        );
    }
}

export default Cover;
