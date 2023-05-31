import {Component} from "react";
import Swal from "sweetalert2";
import Printer from "config/global/printers/index";
import {MODAL} from "constants/modalTypes";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {GlobalStates} from "config/global";
import Services from "services/index";
import PageOrder, {PageOrderState} from "../../../orders";
import {payment_types} from "../../../../../../constants/paymentTypes";
import clone from "clone";
import Table from "../../../orders/check/components/table";

type PageState = {
    payments: any[]
    coma: boolean
    personCount: number
    allProducts: any[]
    covers: any[]
    selectedProducts: any[]
    paidProducts: any[]
    discounts: any[]
    totalPrice: number
    willPayTotalPrice: number
    remainingPrice: number
};

type PageProps = {
    data: {
        pageOrder: PageOrder,
        pageOrderTable: Table
    }
} & PagePropCommonDocument;

class Checkout extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            payments: [],
            coma: false,
            personCount: 1,
            allProducts: [],
            covers: [],
            selectedProducts: [],
            totalPrice: 0,
            paidProducts: [],
            willPayTotalPrice: 0,
            remainingPrice: 0,
            discounts: []
        };

    }

    componentDidMount() {
        this.sets();
    }

    sets() {
        this.setState((state: PageState) => {
            state.paidProducts = [];
            state.allProducts = [];
            state.selectedProducts = [];

            let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);

            let orders = table.orders;
            if (table.isSafeSales) {
                table.totalPrice = this.props.data.pageOrder.state.totalAmount;
                orders = clone(this.props.data.pageOrder.state.newOrders);
                table.discount = clone(this.props.data.pageOrder.state.newDiscounts);

            }

            orders.forEach((data: any) => {
                let paidPrice = table.paid_orders.findSingle("id", data._id);
                if (paidPrice) {
                    state.paidProducts.push(data)
                } else {
                    state.allProducts.push(data);
                }
            })

            state.remainingPrice = table.totalPrice;

            if (table.isSafeSales || GlobalStates.isFastPayment) {
                state.allProducts.forEach(product => {
                    state.selectedProducts.push(product);
                })
                state.willPayTotalPrice = table.totalPrice;
                state.remainingPrice = 0;
                state.allProducts = [];
            }

            GlobalStates.isFastPayment = false;

            return state;
        })
    }

    updateToBePaid(item: any) {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        if (table.isSafeSales) {
            table.totalPrice = this.props.data.pageOrder.state.totalAmount;
        }

        this.setState((state: PageState) => {
            state.allProducts = state.allProducts.filter(product => item._id != product._id);
            state.selectedProducts.push(item);

            state.remainingPrice -= item.price;

            if (state.remainingPrice < 0) {
                state.remainingPrice = 0;
                state.willPayTotalPrice = table.totalPrice;
            } else if (state.allProducts.length === 0) {
                state.willPayTotalPrice = table.totalPrice;
                state.remainingPrice = 0;
            } else {
                state.willPayTotalPrice += item.price;
            }

            return state;
        })
    }

    updateCheck(product: any) {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        if (table.isSafeSales) {
            table.totalPrice = this.props.data.pageOrder.state.totalAmount;
        }

        this.setState((state: PageState) => {
            let findIndex = state.selectedProducts.indexOfKey("_id", product._id);
            state.selectedProducts.remove(findIndex);
            state.allProducts.push(product);

            state.willPayTotalPrice -= product.price;

            if (state.willPayTotalPrice < 0) {
                state.willPayTotalPrice = 0;
                state.remainingPrice = table.totalPrice;
            } else {
                state.remainingPrice += product.price;
            }

            state.allProducts = state.allProducts.orderBy("_id", "asc");
            return state;
        })
    }

    successMessage() {
        Swal.fire({
            icon: "success",
            title: this.props.router.t("payment"),
            html: this.props.router.t("payment-success"),
        });
    }

    async handlePayment(type: number) {
        if (this.state.selectedProducts.length === 0 && this.state.willPayTotalPrice === 0) {
            Swal.fire({
                title: this.props.router.t("amount-payable"),
                icon: "error",
            });
            return;
        }

        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);

        Swal.fire({
            title: this.props.router.t("pleaseWait").toCapitalizeCase(),
            html: this.props.router.t("uploading") + "...",
            showConfirmButton: false,
            showCancelButton: false,
            allowOutsideClick: false,
            willOpen(popup: HTMLElement) {
                Swal.showLoading()
            }
        });

        if (table.isSafeSales) {
            table.totalPrice = this.props.data.pageOrder.state.totalAmount;

            if (this.state.selectedProducts.length === 0) {
                if (table.totalPrice > this.state.willPayTotalPrice) {
                    this.props.data.pageOrder.setState({
                        totalAmount: this.props.data.pageOrder.state.totalAmount - this.state.willPayTotalPrice
                    }, () => {
                        this.setState((state: PageState) => {
                            let paymentIndex = state.payments.indexOfKey("type", type);
                            if (paymentIndex > -1) {
                                state.payments[paymentIndex].amount += Number(this.state.willPayTotalPrice);
                            } else {
                                state.payments.push({
                                    type: type,
                                    amount: this.state.willPayTotalPrice,
                                    currency: "TL",
                                });
                            }
                            state.willPayTotalPrice = 0;
                            return state;
                        }, () => {
                            Swal.close();
                        })
                    })
                    return
                }
            }

            // Set Order
            let resData = await this.setOrder(this.state.selectedProducts.length > 0 ? this.state.selectedProducts : this.state.allProducts);
            // Set Discount
            for (let i = 0; i < this.props.data.pageOrder.state.newDiscounts.length; i++) {
                let discount = this.props.data.pageOrder.state.newDiscounts[i];
                await Services.Post.discount({
                    tableId: GlobalStates.SelectedTableId,
                    ...discount
                });
            }

            if (resData.status && Array.isArray(resData.data?.orders)) {
                await new Promise(resolve => {
                    this.setState((state: PageState) => {
                        if (state.selectedProducts.length > 0) {
                            state.selectedProducts = resData.data.orders;
                        } else {
                            state.allProducts = resData.data.orders;
                        }
                        return state;
                    }, () => {
                        resolve(0)
                    })
                })
            } else {
                Swal.fire({
                    title: this.props.router.t("amount-payable"),
                    icon: "error",
                });
                return;
            }
        }

        let payData: any[] = [];
        this.state.selectedProducts.forEach(item => {
            payData.push({
                id: item._id,
                quantity: item.quantity
            })
        })
        let printData: any = {
            discount: table.discount,
            cover: table.cover,
            orders: this.state.selectedProducts.map((order: any) => ({
                    name: order.productName,
                    price: order.price,
                    currency: "TL",
                    quantity: order.quantity
                })
            ),
            total: {
                amount: table.totalPrice,
                currency: "TL"
            },
            paymentReceived: {
                amount: this.state.willPayTotalPrice,
                currency: "TL"
            },
        };

        if (type == 6) {
            Swal.close();
            this.props.openModal(MODAL.GET_CUSTOMER, {
                orders: payData,
                isRedirect: (
                    this.state.allProducts.length < 1 ||
                    table.totalPrice <= 0
                ),
                willPayTotalPrice: this.state.willPayTotalPrice,
                pageOrder: this.props.data.pageOrder
            })
            return;
        }

        if (this.state.selectedProducts.length === 0) {
            if (table.totalPrice < this.state.willPayTotalPrice) {
                Swal.fire({
                    icon: "question",
                    title: this.props.router.t("money-back"),
                    showCancelButton: true,
                    confirmButtonText: this.props.router.t("yes"),
                    cancelButtonText: this.props.router.t("no"),
                }).then(async (result: any) => {
                    if (result.isConfirmed) {
                        let tipAmount = this.state.willPayTotalPrice - table.totalPrice;
                        await this.setPayment([
                            {
                                tableId: GlobalStates.SelectedTableId,
                                orders: Array(),
                                payments: this.state.payments.concat(
                                    {type: 14, amount: tipAmount, currency: "TL"},
                                    {type: type, amount: this.state.willPayTotalPrice - tipAmount, currency: "TL"}
                                )
                            }
                        ])

                        if (table.isSafeSales) {
                            this.props.data.pageOrder.setState({
                                newOrders: [],
                                newDiscounts: [],
                                totalAmount: 0
                            }, () => {
                                this.successMessage()
                                this.props.closeModal();
                            })
                        } else {
                            this.closeTable();
                        }
                    } else {
                        await this.setPayment([
                            {
                                tableId: GlobalStates.SelectedTableId,
                                orders: Array(),
                                payments: this.state.payments.concat(
                                    {type: type, amount: this.state.willPayTotalPrice, currency: "TL"}
                                )
                            }
                        ]);

                        if (table.isSafeSales) {
                            this.props.data.pageOrder.setState({
                                newOrders: [],
                                newDiscounts: [],
                                totalAmount: 0
                            }, () => {
                                this.successMessage()
                                this.props.closeModal();
                            })
                        } else {
                            this.closeTable();
                        }
                    }
                });
                return;
            }

            if (table.totalPrice === this.state.willPayTotalPrice) {
                await this.setPayment([
                    {
                        tableId: GlobalStates.SelectedTableId,
                        orders: Array(),
                        payments: this.state.payments.concat(
                            {type: type, amount: this.state.willPayTotalPrice, currency: "TL"}
                        )
                    }
                ]);

                if (table.isSafeSales) {
                    this.props.data.pageOrder.setState({
                        newOrders: [],
                        newDiscounts: [],
                        totalAmount: 0
                    }, () => {
                        this.successMessage()
                        this.props.closeModal();
                    })
                } else {
                    this.closeTable();
                }
                return;
            }

            await this.setPayment([
                {
                    tableId: GlobalStates.SelectedTableId,
                    orders: Array(),
                    payments: this.state.payments.concat(
                        {type: type, amount: this.state.willPayTotalPrice, currency: "TL"}
                    )
                }
            ]);
            this.successMessage()
            return;
        }

        await this.setPayment([
            {
                tableId: GlobalStates.SelectedTableId,
                orders: payData,
                payments: this.state.payments.concat(
                    {type: type, amount: this.state.willPayTotalPrice, currency: "TL"}
                )
            }
        ]);

        let tables = this.props.getGlobalData.AllTables.map(table => {
            if (table._id == GlobalStates.SelectedTableId) {
                table.paid_orders = table.paid_orders.concat(payData);
            }
            return table;
        });
        this.props.setGlobalData({
            AllTables: tables
        }, () => {
            this.setState((state: PageState) => {
                state.selectedProducts.forEach(item => {
                    state.allProducts = state.allProducts.filter(product => product._id !== item._id);
                    state.paidProducts.push(item);
                })
                state.selectedProducts = [];
                state.willPayTotalPrice = 0;
                state.remainingPrice = table.totalPrice;
                return state;
            }, () => {
                Swal.fire({
                    title: this.props.router.t("receipt-question"),
                    icon: "question",
                    showConfirmButton: true,
                    showCancelButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        let section = this.props.getGlobalData.Sections.findSingle("_id", GlobalStates.CurrentTable.section);
                        Printer.ProductsInOrder.printProductsInOrder({
                            ...printData,
                            table: GlobalStates.CurrentTable.isSafeSales ? this.props.router.t("case-sale") : `${section?.title} ${GlobalStates.CurrentTable.title}`
                        });
                    }

                    if (
                        this.state.allProducts.length < 1 ||
                        table.totalPrice <= 0 ||
                        (table.isSafeSales && this.props.data.pageOrder.state.totalAmount <= 0)
                    ) {
                        this.setState({
                            coma: false,
                        });

                        if (table.isSafeSales) {
                            this.props.data.pageOrder.setState({
                                newOrders: [],
                                newDiscounts: [],
                                totalAmount: 0
                            }, () => {
                                this.successMessage()
                                this.props.closeModal();
                            })
                        } else {
                            this.closeTable();
                        }
                    } else {
                        this.successMessage()
                    }
                });
            })
        });
    }

    setOrder(products: any[]) {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        return new Promise<any>(resolve => {
            let params = {
                tableId: GlobalStates.SelectedTableId,
                products: products.map(product => ({
                    product: product.productId,
                    isFirst: this.props.data.pageOrderTable.state.sendFirst.includes(product._id) ?? false,
                    quantity: product.quantity,
                    price: product.priceId,
                    options: product.options ?? [],
                    note: product.note
                }))
            };
            (table.orders.length === 0
                ? Services.Post.order(params)
                : Services.Put.orders(params)).then(resData => {
                resolve(resData)
            });
        })
    }

    setPayment(payments: any[]) {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        return new Promise(async resolve => {
            let payedPayments: any[] = [];
            for (let i = 0; i < payments.length; i++) {
                let payment = payments[i];
                let resData = await Services.Post.checks(payment);
                if (resData.status) {
                    payedPayments = payedPayments.concat(payment.payments);
                } else {
                    Swal.fire({
                        title: this.props.router.t("error"),
                        icon: "error",
                    });
                    resolve(0)
                    return;
                }
            }

            if (table.isSafeSales) {
                this.props.data.pageOrder.setState((state: PageOrderState) => {
                    state.newOrders = this.state.allProducts.filter(product => this.state.selectedProducts.indexOfKey("_id", product._id) === -1)
                    state.totalAmount = state.totalAmount - this.state.willPayTotalPrice;
                    return state;
                }, () => {
                    this.setState((state: PageState) => {
                        state.willPayTotalPrice = 0;
                        state.remainingPrice = this.props.data.pageOrder.state.totalAmount;
                        return state;
                    }, () => {
                        resolve(0)
                    })
                });
                return;
            }

            let tables = this.props.getGlobalData.AllTables.map(table => {
                if (table._id == GlobalStates.SelectedTableId) {
                    let totalPaymentPrice = 0;
                    payments.forEach(payment => {
                        let paymentIndex = table.payments.indexOfKey("type", payment.type);
                        if (paymentIndex > -1) {
                            table.payments[paymentIndex].amount += Number(payment.amount);
                        } else {
                            table.payments.push(payment);
                        }
                        totalPaymentPrice += Number(payment.amount);
                    })
                    table.totalPrice -= totalPaymentPrice;
                }
                return table;
            });
            this.props.setGlobalData({
                AllTables: tables
            }, () => {
                let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
                this.setState((state: PageState) => {
                    state.willPayTotalPrice = 0;
                    state.remainingPrice = table.totalPrice;
                    return state;
                }, () => {
                    resolve(0)
                })
            });
        })
    }

    closeTable() {
        let tables = this.props.getGlobalData.AllTables.map(table => {
            if (table._id == GlobalStates.SelectedTableId) {
                table.paid_orders = [];
                table.payments = [];
                table.orders = [];
                table.cover = [];
                table.discount = [];
                table.busy = false;
                table.totalPrice = 0;
            }
            return table;
        });
        this.props.setGlobalData({
            AllTables: tables
        }, () => {
            this.props.closeModal();
            Swal.fire({
                title: this.props.router.t("paid-succes"),
                icon: "success",
            }).then(() => {
                this.props.router.navigate("/", {replace: true});
            });
        });
    }

    splitByPerson() {
        Swal.fire({
            title: this.props.router.t("split-question"),
            icon: "question",
            input: "number",
            inputValue: "1",
            inputAttributes: {
                min: "1",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);

                this.setState({
                    personCount: result.value,
                });
                this.setState({
                    willPayTotalPrice: table.totalPrice / result.value
                })
            }
        });
    }

    handleCalculator(value: number | string): void {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);

        let self = this;
        if (this.state.selectedProducts.length > 0) {
            Swal.fire({
                title: this.props.router.t("first-pay"),
                icon: "warning",
            });
            return;
        }

        function updateWillPayTotalPrice(price: number) {
            let reamingPrice = table.totalPrice - price < 0 ? 0 : table.totalPrice - price;
            self.setState({
                willPayTotalPrice: price,
                remainingPrice: reamingPrice
            })
        }

        switch (value) {
            case "C":
                updateWillPayTotalPrice(0)
                this.setState({coma: false});
                GlobalStates.Cash = false;
                break;
            case "floor":
                updateWillPayTotalPrice(this.state.willPayTotalPrice | 0)
                break;
            case "byPerson":
                this.splitByPerson();
                break;
            case "00":
                if (this.state.coma) {
                } else {
                    updateWillPayTotalPrice(this.state.willPayTotalPrice * 100)
                }
                break;
            case ",":
                this.setState({coma: true});
                break;
            case "%":
                GlobalStates.CurrentModal = MODAL.DISCOUNT;
                GlobalStates.ModalOpen = true;
                break;
            case "split":
                break;
            case "Servis":
                break;
            default:
                GlobalStates.Cash = true;
                if (this.state.coma) {
                    let arr = this.state.willPayTotalPrice.toString().split(".");
                    let sum = Number(value) / Math.pow(10, arr.length);
                    updateWillPayTotalPrice(sum + this.state.willPayTotalPrice)
                } else {
                    updateWillPayTotalPrice(this.state.willPayTotalPrice * 10 + Number(value))
                }

                break;
        }
    }

    handleSelectAll(): void {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        let tbp = [...this.state.selectedProducts];
        this.state.allProducts.forEach((element: any) => {
            tbp.push(element);
        });
        this.setState({
            selectedProducts: tbp
        })
        this.setState({
            willPayTotalPrice: table.totalPrice
        })
        this.setState({
            allProducts: []
        })
    }

    handlePrint(): void {
        throw new Error("Function not implemented.");
    }

    render() {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId);
        if (table.isSafeSales) {
            table.totalPrice = this.props.data.pageOrder.state.totalAmount;
        }
        return (
            <div className="checkout">
                <div>
                    {this.props.router.t("collections")}
                    <div className="product">
                        <div className="amount">
                            <span>{this.props.router.t("quantity")}</span>
                        </div>
                        <div className="product">
                            <span>{this.props.router.t("product")}</span>
                        </div>
                        <div className="price">
                            <span>{this.props.router.t("price")}</span>
                        </div>
                    </div>
                    <div className="collectionTable">
                        {

                            (table.isSafeSales ? this.state.payments : table.payments).map((payment: any) => (
                                <div className="product list">
                                    <div className="product">
                                        <span>{payment_types[Number(payment.type) - 1]}</span>
                                    </div>
                                    <div className="price">
                                        <span>{Number(payment.amount).toFixed(2)} {payment.currency}</span>
                                    </div>
                                </div>
                            ))
                        }
                        {
                            this.state.discounts.map((item: any) => {
                                return (
                                    <div className="product list">
                                        <div className="amount">
                                            <span>1</span>
                                        </div>
                                        <div className="product">
                                            <span>{this.props.router.t("discount")}</span>
                                        </div>
                                        <div className="price">
                                            <span>{Number(item.amount).toFixed(2)} TL</span>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                    {this.props.router.t("all-products")}
                    <div className="product">
                        <div className="amount">
                            <span>{this.props.router.t("quantity")}</span>
                        </div>
                        <div className="product">
                            <span>{this.props.router.t("product")}</span>
                        </div>
                        <div className="price">
                            <span>{this.props.router.t("price")}</span>
                        </div>
                    </div>
                    <div className="collectionTable">
                        {
                            this.state.allProducts.map((item: any) => {
                                return (
                                    <div
                                        onClick={() => this.updateToBePaid(item)}
                                        className="product list"
                                    >
                                        <div className="amount">
                                            <span>{item.quantity}</span>
                                        </div>
                                        <div className="product">
                                            <span>{item.productName}</span>
                                        </div>
                                        <div className="price">
                                            <span>{Number(item.price).toFixed(2)} TL</span>
                                        </div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className="middle">
                    {this.props.router.t("payment")}
                    <div className="table">
                        <div className="product">
                            <div className="amount">
                                <span>{this.props.router.t("quantity")}</span>
                            </div>
                            <div className="product">
                                <span>{this.props.router.t("product")}</span>
                            </div>
                            <div className="price">
                                <span>{this.props.router.t("price")}</span>
                            </div>
                        </div>
                        <div className="collectionTable currentlypaying">
                            {this.state.selectedProducts.map((item: any) => (
                                <div
                                    onClick={() => this.updateCheck(item)}
                                    className="product list"
                                >
                                    <div className="amount">
                                        <span>{item.quantity}</span>
                                    </div>
                                    <div className="product">
                                        <span>{item.productName}</span>
                                    </div>
                                    <div className="price">
                                        <span>{Number(item.price).toFixed(2)} TL</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="calculator">
                        <div onClick={() => this.handleCalculator(1)}>1</div>
                        <div onClick={() => this.handleCalculator(2)}>2</div>
                        <div onClick={() => this.handleCalculator(3)}>3</div>

                        <div
                            className="rightbuttons"
                            onClick={() => this.handleCalculator("C")}
                        >
                            C
                        </div>

                        <div onClick={() => this.handleCalculator(4)}>4</div>
                        <div onClick={() => this.handleCalculator(5)}>5</div>
                        <div onClick={() => this.handleCalculator(6)}>6</div>

                        <div
                            className="rightbuttons"
                            onClick={() => this.handleCalculator("floor")}
                        >
                            {this.props.router.t("ball")}
                        </div>

                        <div onClick={() => this.handleCalculator(7)}>7</div>
                        <div onClick={() => this.handleCalculator(8)}>8</div>
                        <div onClick={() => this.handleCalculator(9)}>9</div>

                        <div
                            className="rightbuttons"
                            onClick={() => this.handleSelectAll()}
                        >
                            {this.props.router.t("all")}
                        </div>

                        <div onClick={() => this.handleCalculator("00")}>00</div>
                        <div onClick={() => this.handleCalculator(0)}>0</div>
                        <div onClick={() => this.handleCalculator(",")}>,</div>

                        <div
                            className="rightbuttons"
                            onClick={() => this.handleCalculator("byPerson")}
                        >
                            1/{this.props.router.t("person")}
                        </div>

                        <div
                            onClick={() => this.handleCalculator("%")}
                            className="bottom discount"
                        >
                            % {this.props.router.t("discount")}
                        </div>
                        <div className="bottom print" onClick={(_) => this.handlePrint()}>
                            {this.props.router.t("print")}
                        </div>
                        {/* <div onClick={() => handleCalculator("Servis")} className="bottom service">Servis Ücret</div>
                        <div onClick={() => handleCalculator("split")} className="bottom split">Parçalı Ödeme</div>  */}
                    </div>
                </div>
                <div>
                    <div className="totals">
                        <div className="total">
                            <div>{this.props.router.t("total-amount")}:</div>
                            <div className="price">
                                {table.totalPrice.toFixed(2)} TL
                            </div>
                        </div>
                        <div className="total">
                            <div>{this.props.router.t("amount-paid")}:</div>
                            <div className="price">
                                {this.state.willPayTotalPrice.toFixed(2)} TL
                            </div>
                        </div>
                        <div className="total">
                            <div>{this.props.router.t("remaining-amount")}:</div>
                            <div className="price">
                                {this.state.remainingPrice.toFixed(2)} TL
                            </div>
                        </div>
                        {
                            table.totalPrice - this.state.willPayTotalPrice < 0
                                ? <div className="total">
                                    <div>{this.props.router.t("money-back-title")}:</div>
                                    <div className="price">
                                        {(table.totalPrice - this.state.willPayTotalPrice).toFixed(2)} TL
                                    </div>
                                </div> : null
                        }
                    </div>
                    <div className="payment">
                        <div onClick={() => this.handlePayment(2)}>
                            {this.props.router.t("cash")}
                        </div>
                        <div onClick={() => this.handlePayment(1)}>
                            {this.props.router.t("credit-card")}
                        </div>
                        <div onClick={() => this.handlePayment(6)}>
                            {this.props.router.t("ticks")}
                        </div>
                        <div onClick={() => this.handlePayment(11)}>SetCard</div>
                        <div onClick={() => this.handlePayment(7)}>Sodexo</div>
                        <div onClick={() => this.handlePayment(10)}>Multinet</div>
                        <div onClick={() => this.handlePayment(8)}>Smart</div>
                        <div onClick={() => this.handlePayment(12)}>Metropol</div>
                        <div onClick={() => this.handlePayment(1)}>Yemeksepeti Online</div>
                        <div onClick={() => this.handlePayment(1)}>Trendyol Yemek</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Checkout;
