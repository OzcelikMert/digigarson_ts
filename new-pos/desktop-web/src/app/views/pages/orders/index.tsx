import {Component} from "react";
import Navbar from "./navbar";
import Couriers from "./couriers/couriers";
import Category from "./category/category";
import Printer from "../../../../config/global/printers/index";
import {PagePropCommonDocument} from "../../../../modules/views/pages/pageProps";
import {GlobalStates} from "config/global";
import Functions from "../../../../config/global/functions/index";
import Product from "./products/product";
import {MODAL} from "../../../../constants/modalTypes";
import Table from "./check/components/table";
import clone from "clone";
import Payments from "./payments";
import {Navigate} from "react-router-dom";

export type PageOrderState = {
    clickedProduct: any;
    totalAmount: number;
    currentCategoryId: string
    multiplier: number
    newOrders: any[]
    newDiscounts: any[]
    selectedProduct: any
    modal: {
        isOpen: boolean,
        type: any,
        data: any
    }
    searchKeyProduct: string
    searchKeyCategory: string
    searchKeyCustomerPhone: string
    searchKeyCustomerName: string
    isSelectCourier: boolean
    isSelectPayment: boolean
};

type PageProps = {} & PagePropCommonDocument;

class PageOrder extends Component<PageProps, PageOrderState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            clickedProduct: "",
            totalAmount: 0,
            currentCategoryId: "all",
            multiplier: 1,
            newOrders: [],
            newDiscounts: [],
            selectedProduct: [],
            searchKeyCategory: "",
            searchKeyProduct: "",
            searchKeyCustomerPhone: "",
            searchKeyCustomerName: "",
            isSelectCourier: false,
            isSelectPayment: false,
            modal: {
                isOpen: false,
                type: null,
                data: null
            }
        };
    }

    productHandleClick(product: any, priceId?: string) {
        let forced = false;
        if (product.sale_type == 5) {
            this.handleNoteClick(product);
            return;
        }
        product.options?.forEach((option: any) => {
            if (option.is_forced_choice) {
                this.handleNoteClick(product);
                forced = true;
                return;
            }
        });
        if (forced) {
            return;
        }
        this.setNewOrderProduct(product, this.state.multiplier);
    }

    handleNoteClick(product: any) {
        product.options.forEach((item: any) => {
            item.linked = this.props.getGlobalData.ProductOptions?.findSingle("_id", item.option_id);
        })
        this.setState({
            selectedProduct: product
        }, () => this.props.openModal(MODAL.OPTION, this));
    }

    setNewOrderProduct(product: any, addCount: number, isHaveOptions?: boolean, note?: string, priceId?: string) {
        this.setState((state: PageOrderState) => {
            product = clone(product);
            let priceIndex = typeof priceId !== "undefined" ? product.prices.indexOfKey("_id", priceId) : 0;
            priceId = product.prices[priceIndex]._id;
            product.prices[priceIndex].amount *= product.prices[priceIndex].amount * addCount;
            product.prices[priceIndex].price *= product.prices[priceIndex].amount;
            if (product.options) {
                product.options.forEach((option: any) => {
                    option.linked.items.forEach((item: any) => {
                        product.prices[priceIndex].price += Number(item.price) * Number(product.prices[priceIndex].amount);
                    })
                })
            }
            let isNew: boolean = true;
            state.newOrders.map((order: any) => {
                if (
                    order.productId == product._id &&
                    JSON.stringify(order.options) == JSON.stringify(product.options) &&
                    priceId == order.priceId
                ) {
                    order.quantity += product.prices[priceIndex].amount;
                    order.price += product.prices[priceIndex].price;
                    isNew = false;
                }
                return order;
            })

            if (isNew) {
                let newOrderId = Functions.createUUID();
                state.newOrders.push({
                    productId: product._id,
                    productName: product.title,
                    _id: newOrderId,
                    price: product.prices[priceIndex].price,
                    priceId: priceId,
                    quantity: product.prices[priceIndex].amount,
                    options: (!isHaveOptions)
                        ? Array()
                        : product?.options?.map((option: any) => ({
                            option_id: option?.linked?._id,
                            items: option?.linked?.items?.map((option_item: any) => ({
                                item_id: option_item._id,
                                price: Number(option_item.price) * Number(product.prices[priceIndex].amount)
                            }))
                        })),
                    note: note ?? ""
                });
            }
            state.multiplier = 1;
            if (
                GlobalStates.CurrentTable?.isSafeSales ||
                GlobalStates.CustomerId ||
                !GlobalStates.CustomerId
            ) {
                state.totalAmount += product.prices[priceIndex].price;
            }
            return state;
        })
    }

    print() {
        Printer.Check.printCheck(GlobalStates.AllCheck);
        //Printer.printKitchen(Fetchs.Check.data)
    }

    onClickMultiplier(number: number) {
        this.setState({
            multiplier: number
        });
    }

    onSearchProduct(search: string) {
        this.setState({
            searchKeyProduct: search
        });
    }

    onSearchCategory(search: string) {
        this.setState({
            searchKeyCategory: search
        });
    }

    render() {
        let table = this.props.getGlobalData.AllTables.findSingle("_id", GlobalStates.SelectedTableId)
        return table ? (
            <div style={{position: "absolute", top: "0", width: "100%"}}>
                <Navbar
                    newOrders={this.state.newOrders}
                    multiplier={this.state.multiplier}
                    onClickMultiplier={(number: number) => this.onClickMultiplier(number)}
                    onSearchProduct={(search: string) => this.onSearchProduct(search)}
                    onSearchCategory={(search: string) => this.onSearchCategory(search)}
                    {...this.props}
                />
                <div className="row">
                    <div id="account" className="col">
                        <div className="adisyonContainer">
                            <Table
                                {...this.props}
                                pageOrder={this}
                            />
                        </div>
                    </div>
                    <div id="products" className="col">
                        {
                            this.state.isSelectPayment
                                ? <Payments pageOrder={this} {...this.props} />
                                : this.state.isSelectCourier
                                    ? <Couriers pageOrder={this} {...this.props}/>
                                    : <div className="productsContainer">
                                        {
                                            clone(this.props.getGlobalData.Products)
                                                .filter(item => item.title?.toString().toLowerCase().search(this.state.searchKeyProduct.toLowerCase()) > -1)
                                                .filter(item => this.state.currentCategoryId === "all" || this.state.currentCategoryId === item.category)
                                                .map((item: any, index) =>
                                                    <Product
                                                        key={index}
                                                        title={item.title}
                                                        price={item.prices[0].price}
                                                        currency={item.prices[0].currency}
                                                        onClick={() => this.productHandleClick(item)}
                                                        onClickNote={() => this.handleNoteClick(item)}
                                                    />
                                                )
                                        }
                                    </div>
                        }
                    </div>
                    <div id="btnCategory" style={{display: "block", width: "35%"}} className="col">
                        <div className="categoryButton">
                            {
                                [{
                                    title: this.props.router.t("all"),
                                    _id: "all"
                                }].concat(clone(this.props.getGlobalData.Categories || [])
                                    .filter((item: any) => item.title?.toString().toLowerCase().search(this.state.searchKeyCategory.toLowerCase()) > -1))
                                    .map((item, index) =>
                                        <Category
                                            {...this.props}
                                            key={index}
                                            isSelected={this.state.currentCategoryId === item._id}
                                            categoryId={item._id}
                                            title={item.title}
                                            onClick={() => this.setState({currentCategoryId: item._id})}
                                        />
                                    )
                            }
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <Navigate to="/"/>
        );
    }
}

export default PageOrder;
