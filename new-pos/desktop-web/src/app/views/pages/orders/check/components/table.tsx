import React, {Component} from "react";
import "../check.css";
import Swal from "sweetalert2";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {GlobalStates} from "config/global";
import Functions from "../../../../../../config/global/functions/index";
import ColorPicker from "./colorPicker";
import "./buttonRight.css";
import PageOrder from "../../index";

export type TableState = {
    isChecked: boolean
    isAllChecked: boolean
    selectedProductId: string[]
    sendFirst: string[]
    isColorPickerFired: boolean
};

type PageProps = {
    pageOrder: PageOrder
} & PagePropCommonDocument;

class Table extends Component<PageProps, TableState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            sendFirst: [],
            isChecked: true,
            isAllChecked: false,
            selectedProductId: [],
            isColorPickerFired: false
        }
    }

    getAddress(id: any) {
        if (GlobalStates.CustomerId) {
            let add = "",
                title = "",
                phone = "";

            this.props.getGlobalData.AllCustomers.map((customer: any) => {
                if (customer.id === id) {
                    add = customer?.address[0].address;
                    title = customer?.address[0].title;
                    phone = customer.gsm_no;
                }
            });
            let totalAddress = `Adres Başlığı: ${title}` + "\n" + `Address: ${add}`;
            return totalAddress;
        }
    }

    getOrderOption(options: any, note?: string) {
        let optionNames = "";
        options.forEach((option: any) => {
            let findOption = this.props.getGlobalData.ProductOptions.findSingle("_id", option.option_id);
            optionNames += `<b>${findOption?.name}</b><br>`;
            option.items.forEach((item: any) => {
                let findOptionItem = findOption?.items.findSingle("_id", item.item_id);
                optionNames += `${findOptionItem?.item_name}, `;
            })
            optionNames = optionNames.removeLastChar(2);
            optionNames += `<br><br>`;
        });
        if (note) {
            optionNames += `<b>Not</b><br>${note}<br><br>`
        }
        return optionNames;
    }

    optionOrderPopup(pc: any): void {
        if (pc.options.length > 0 || pc.note) {
            Swal.fire({
                title: `<b>Opsiyonlar</b>`,
                html: this.getOrderOption(pc.options, pc.note),
                confirmButtonText: this.props.router.t("close"),
            });
        } else {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("no-option"),
            });
        }
    }

    discountNotePopup(note: string) {
        Swal.fire({
            title: `<b>${this.props.router.t("note")}</b>`,
            text: note,
            confirmButtonText: this.props.router.t("close"),
        });
    }

    onSelectedProduct(uid: string) {
        this.setState((state: TableState) => {
            let findIndex = state.selectedProductId.indexOfKey("", uid);
            if (findIndex > -1) {
                state.selectedProductId.remove(findIndex);
                findIndex = state.sendFirst.indexOfKey("", uid);
                if (findIndex > -1) {
                    state.sendFirst.remove(findIndex)
                }
            } else {
                state.selectedProductId.push(uid);
            }
            state.isAllChecked = false;
            return state;
        })
    }

    handleCheckAll(event: any) {
        this.setState((state: TableState) => {
            state.isAllChecked = event.target.checked;
            state.selectedProductId = [];
            if (state.isAllChecked) {
                let table: any = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
                table.orders.concat(this.props.pageOrder.state.newOrders).forEach((item: any) => {
                    state.selectedProductId.push(item._id);
                })
            }
            return state;
        })
    };

    onClick(type: string) {
        if (type === "sendOrder") {
            if (GlobalStates.CustomerId) {
                if (!GlobalStates.SelectedPaymentTypeId) {
                    this.props.pageOrder.setState({
                        isSelectPayment: true
                    })
                    return;
                } else if (!GlobalStates.SelectedCourierId) {
                    this.props.pageOrder.setState({
                        isSelectCourier: true
                    })
                    return;
                }
            }
        }

        Functions.handleClick(
            type,
            this.props,
            this.props.pageOrder,
            this
        )
    }

    Orders = (order: any) => {
        return (
            <tr>
                <td>
                    <input
                        type="checkbox"
                        checked={this.state.selectedProductId.includes(order._id)}
                        style={{borderRadius: "3px"}}
                        onChange={(event) => this.onSelectedProduct(order._id)}
                    />
                </td>
                <td className="tableProductCount">
                    {order.quantity}
                </td>
                <td>{order.productName}</td>
                <td>{order.price} TL</td>
                <td>
                    <article
                        onClick={() =>
                            this.optionOrderPopup(order)
                        }
                    >
                        {(order.options.length > 0 || order.note) ? `...` : ``}
                    </article>
                </td>
            </tr>
        );
    }

    Covers = (cover: any) => {
        return (
            <tr>
                <td></td>
                <td>{cover.quantity}</td>
                <td>{cover.title}</td>
                <td>{Number(cover.price).toFixed(2)} TL</td>
                <td>{this.props.router.t("cover")}</td>
            </tr>
        );
    }

    Discounts = (discount: any) => {
        return (
            <tr>
                <td></td>
                <td>1</td>
                <td>
                    {this.props.router.t("discount-table")}
                </td>
                <td>-{Number(discount.amount).toFixed(2)} TL</td>
                <td>
                    <article
                        onClick={() =>
                            this.discountNotePopup(discount.note)
                        }
                    >
                        ...
                    </article>
                </td>
            </tr>
        );
    }

    ButtonBottom = () => (
        <div className="buttonBottom">
            {GlobalStates.BottomButtons &&
                GlobalStates.BottomButtons.map((button: any, i: number) => (
                    <button
                        key={i}
                        style={{backgroundColor: button?.color}}
                        onClick={(event) => this.onClick(button?.name)}
                        onContextMenu={(event) =>
                            Functions.handleRightClick(
                                this,
                                event,
                                i,
                                button,
                                "bottom",
                                this.props
                            )
                        }
                        data-toggle="modal"
                        data-target="#globalModal"
                    >
                        {this.props.router.t(button.name)}
                    </button>
                ))}
        </div>
    )
    ButtonRight = () => {
        let buttons = GlobalStates.CustomerId
            ? GlobalStates.TakeawayButtons
            : GlobalStates.CurrentTable.isSafeSales
                ? GlobalStates.CaseSaleButtons
                : GlobalStates.RightButtons;
        return (
            <div className="rightButtons">
                {
                    this.state.isColorPickerFired
                        ? <ColorPicker {...this.props} pageOrderTable={this}/>
                        : null
                }
                {buttons &&
                    buttons?.map((button: any, i: number) => (
                        <button
                            key={i}
                            style={{backgroundColor: button.color}}
                            onClick={(event) => this.onClick(button?.name)}
                            onContextMenu={(event) =>
                                Functions.handleRightClick(
                                    this,
                                    event,
                                    i,
                                    button,
                                    "right",
                                    this.props
                                )
                            }
                            data-toggle="modal"
                            data-target="#globalModal"
                        >
                            {this.props.router.t(button.name)}
                        </button>
                    ))}
            </div>
        )
    }

    render() {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId)
        let tableName = `${this.props.getGlobalData.Sections.findSingle("_id", GlobalStates.CurrentTable.section)?.title || ""} ${GlobalStates.CurrentTable.title}`;
        if (GlobalStates.CurrentTable.isSafeSales) {
            tableName = this.props.router.t("case-sale");
        }
        return (
            <>
                <div className="tableContainer">
                    <div className="titleinfo">
                        <strong>{tableName}</strong>
                        <span>
                            <strong> {this.props.router.t("total")} : </strong>
                            {Number((table.isSafeSales ? 0 : Number(table.totalPrice)) + Number(this.props.pageOrder.state.totalAmount)).toFixed(2)} TL
                        </span>
                    </div>
                    <div className="Tablebox">
                        <table className="adisyonTable">
                            <thead>
                            <tr>
                                <th>
                                    <input
                                        type="checkbox"
                                        style={{borderRadius: "3px"}}
                                        checked={this.state.isAllChecked}
                                        onChange={(event) => this.handleCheckAll(event)}
                                    />
                                </th>
                                <th className="tableProductCount">
                                    {" "}
                                    {this.props.router.t("quantity")}
                                </th>
                                <th>{this.props.router.t("name")}</th>
                                <th>{this.props.router.t("price")}</th>
                                <th>Opsiyonlar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                table.cover.map((cover: any) =>
                                    <this.Covers {...cover} />
                                )
                            }
                            {
                                !table.isSafeSales
                                    ? table.orders.findMulti("isDeleted", false).map((pc: any, index: any) =>
                                        <this.Orders {...pc} key={index}/>) : null
                            }
                            {
                                this.props.pageOrder.state.newOrders.findMulti("uid", this.state.sendFirst).map((pc: any, index) =>
                                    <this.Orders {...pc} key={index}/>
                                )
                            }
                            {
                                this.state.sendFirst.length > 0 ? (
                                    <tr>
                                        <th colSpan={5}>
                                            <hr style={{
                                                borderTopWidth: "3px",
                                                borderColor: "black",
                                                borderStyle: "dotted"
                                            }}/>
                                        </th>
                                    </tr>
                                ) : null
                            }
                            {
                                this.props.pageOrder.state.newOrders.filter(order => !this.state.sendFirst.includes(order.uid)).map((pc: any, index) =>
                                    <this.Orders {...pc} key={index}/>
                                )
                            }
                            {
                                table.discount.map((discount: any) =>
                                    <this.Discounts {...discount} />
                                )
                            }
                            {
                                this.props.pageOrder.state.newDiscounts.map((discount: any) =>
                                    <this.Discounts {...discount} />
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                    <span> {this.getAddress(GlobalStates.CustomerId)}</span>
                    {!GlobalStates.CustomerId && !GlobalStates.CurrentTable.isSafeSales && (
                        <this.ButtonBottom/>
                    )}
                </div>
                <this.ButtonRight/>
            </>
        );
    }
}

export default Table;
