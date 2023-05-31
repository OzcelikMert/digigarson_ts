import {Component} from "react";
import "./index.css";
import {PagePropCommonDocument,} from "modules/views/pages/pageProps";
import {GlobalStates} from "config/global";
import Services from "../../../../../../services/index";
import clone from "clone";
import V from "../../../../../../library/variable";

type PageState = {
    orders: any[];
    oldOrders: any[]
};

type PageProps = {
    data: string[]
} & PagePropCommonDocument;

class Index extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            orders: [],
            oldOrders: []
        };
    }

    componentDidMount() {
        this.sets();
    }

    sets() {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        this.setState({
            orders: clone(table.orders.findMulti('_id', this.props.data)),
            oldOrders: clone(table.orders.findMulti('_id', this.props.data))
        })
    }

    onSubmit() {
        this.state.orders.forEach(order => {
            const data = {
                orderId: order._id,
                tableId: GlobalStates.SelectedTableId,
                quantity: order.quantity,
                price: Number(order.price),
                product: order.productId,
                options: order.options,
            };
            Services.Put.productOrders(data).then(resData => {
                if (resData.status) {
                    let tables = this.props.getGlobalData.AllTables.map(table => {
                        if (table._id == data.tableId) {
                            table.orders = table.orders.map((order: any) => {
                                if (order._id == data.orderId) {
                                    table.totalPrice -= order.price;
                                    order.price = data.price;
                                    table.totalPrice += order.price;
                                }
                                return order;
                            })
                        }
                        return table;
                    })
                    this.props.setGlobalData({
                        AllTables: tables
                    })
                }
            });
        })
        this.props.closeModal();
    };

    handlePriceChange = (order: any, newPrice: string) => {
        this.setState((state: PageState) => {
            let findIndex = state.orders.indexOfKey("_id", order._id);
            if (findIndex > -1) {
                newPrice = (V.isEmpty(newPrice))
                    ? order.price
                    : newPrice;
                state.orders[findIndex].price = newPrice;
            }
            return state;
        })
    };

    render() {
        return (
            <>
                <table cellSpacing="0" cellPadding="0">
                    <tr>
                        <td>
                            <table style={{width: "59vw"}} cellSpacing="0" cellPadding="1">
                                <tr style={{color: "white", background: "grey"}}>
                                    <th style={{width: "34vw"}}>
                                        {this.props.router.t("product")}
                                    </th>
                                    <th style={{width: "5vw"}}>Fiyatı</th>
                                    <th style={{width: "20vw"}}>
                                        {this.props.router.t("change-price")}
                                    </th>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div style={{width: "59vw", height: "35vh", overflow: "auto"}}>
                                <table cellSpacing="0" cellPadding="1">
                                    {
                                        this.state.oldOrders.map((order: any) => {
                                            return (
                                                <tr>
                                                    <td style={{width: "34vw", textAlign: "center"}}>
                                                        {order.productName}
                                                    </td>
                                                    <td style={{width: "5vw", textAlign: "center"}}>
                                                        {order.price} TL
                                                    </td>
                                                    <td style={{width: "20vw", textAlign: "center"}}>
                                                        <input
                                                            type="number"
                                                            onChange={(event) =>
                                                                this.handlePriceChange(order, event.target.value)
                                                            }
                                                            style={{width: "40%"}}
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </table>
                            </div>
                        </td>
                    </tr>
                </table>
                <div className="changePriceButtons">
                    <button style={{background: "green"}} onClick={() => this.onSubmit()}>
                        {" "}
                        {this.props.router.t("submit")}
                    </button>
                    <button onClick={() => this.props.closeModal()}>
                        {" "}
                        {this.props.router.t("cancel-ticket")}
                    </button>
                </div>
            </>
        );
    }
}

export default Index;
