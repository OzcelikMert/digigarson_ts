import {Component} from "react";

import Providers from "app/providers"

import "../assets/app/styles/index.css"
import "../index.css"
import "../assets/app/styles/App.css"
import "../assets/app/styles/takeaway.css"

import {
    useLocation,
    useNavigate,
    useParams,
    useSearchParams
} from "react-router-dom";
import {PagePropCommonDocument} from "../modules/views/pages/pageProps";

import {initReactI18next, useTranslation} from "react-i18next";
import i18n from "i18next";
import English from "../resources/en.json";
import Turkish from "../resources/tr.json";
import {AppGlobalGetState, AppGlobalSetState} from "../modules/views";
import Modals from "./views/pages/modals";
import AppRoutes from "./routes";
import {getGlobalAuthData, GlobalStates} from "../config/global";
import LocalStorages from "../config/global/localStorages";
import Services from "services/index";
import Printer from "../config/global/printers";
import clone from "clone";
import Printers from "../config/global/printers";

i18n.use(initReactI18next).init({
    resources: {
        en: {translation: English},
        tr: {translation: Turkish},
    },
    lng: localStorage.getItem("language") || "tr",
    fallbackLng: "tr",
    interpolation: {
        escapeValue: false,
    },
});

type PageState = {
    isPageLoading: boolean,
    isToggleState: boolean
    isSetGlobalData: boolean
    modal: {
        isOpen: boolean,
        type: any,
        data: any
    }
} & AppGlobalGetState;

type PageProps = {} & PagePropCommonDocument;

class App extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            isPageLoading: false,
            isToggleState: false,
            isSetGlobalData: false,
            globalData: {
                caseId: "",
                Categories: [],
                Products: [],
                ProductOptions: [],
                AllTables: [],
                Sections: [],
                Ticks: [],
                AllCourier: [],
                AllCustomers: [],
                AllTakeaway: []
            },
            modal: {
                isOpen: false,
                type: null,
                data: null
            }
        }
    }

    componentDidMount() {
        Printer.Settings.loadSettings();
    }

    componentDidUpdate(prevProps: Readonly<PageProps>, prevState: Readonly<PageState>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            if (this.props.router.location.pathname.endsWith("sign-in")) {
                this.clearInterval();
            }
        }

        if (!this.state.globalData.caseId) {
            this.clearInterval();
        }

        if (
            this.state.isSetGlobalData !== prevState.isSetGlobalData &&
            this.state.isSetGlobalData &&
            this.state.globalData.caseId
        ) {
            this.sets();
        }
    }

    private sets() {
        GlobalStates.RightButtons = LocalStorages.Buttons.get.rightButtons;
        GlobalStates.TakeawayButtons = LocalStorages.Buttons.get.takeawayButtons;
        GlobalStates.BottomButtons = LocalStorages.Buttons.get.bottomButtons;
        GlobalStates.CaseSaleButtons = LocalStorages.Buttons.get.caseSaleButtons;
        this.checkIsPrint();
    }

    interval: NodeJS.Timer | undefined;

    private setInterval() {
        this.interval = setInterval(async () => {
            let tables = (await Services.Get.allTables()).data;
            let takeAway = (await Services.Get.takeaway()).data;
            this.setState((state: PageState) => {
                return {
                    globalData: Object.assign(state.globalData, {
                        AllTables: tables,
                        AllTakeaway: takeAway
                    })
                };
            }, () => {
                console.log(this.state.globalData)
                this.checkIsPrint();
            });
        }, 5000);
    }

    private clearInterval() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    async checkIsPrint() {
        this.clearInterval();
        let self = this;
        let isChange = false;
        let allTables = clone(this.state.globalData.AllTables);
        let allTakeAway = clone(this.state.globalData.AllTakeaway);

        async function invoiceTable(isCancelInvoice: boolean = false) {
            for (let tableIndex = 0; tableIndex < allTables.length; tableIndex++) {
                let invoiceOrders: any[] = [];
                let invoiceFirstOrders: any[] = [];
                let table = allTables[tableIndex];
                let orderId: string[] = [];

                if (table.orders.length > 0) {
                    for (let orderIndex = 0; orderIndex < table.orders.length; orderIndex++) {
                        let order = table.orders[orderIndex];
                        if (!order.isPrint) {
                            if (order.products) {
                                continue;
                            }
                            if (!isCancelInvoice && order?.isDeleted || isCancelInvoice && !order?.isDeleted) continue;
                            let product = clone(self.state.globalData.Products.findSingle("_id", order.productId));
                            if (product) {
                                let isThere = false;
                                LocalStorages.PrinterGroups.get.forEach(group => {
                                    if (group.categories.includes(product.category)) {
                                        /** Set Option Names **/
                                        let optionNames: any[] = [];
                                        if (order.note) {
                                            optionNames.push({
                                                title: "Not",
                                                sub_options: [order.note]
                                            })
                                        }
                                        order.options.forEach((orderOption: any) => {
                                            let option = self.state.globalData.ProductOptions.findSingle("_id", orderOption.option_id);
                                            let subOptions: any[] = [];
                                            if (option && Array.isArray(option.items) && Array.isArray(orderOption.items)) {
                                                orderOption.items.forEach((orderOptionItem: any) => {
                                                    let optionItem = option.items.findSingle("_id", orderOptionItem.item_id);
                                                    if (optionItem) {
                                                        subOptions.push(optionItem.item_name);
                                                    }
                                                })
                                            }
                                            optionNames.push({
                                                title: option.name,
                                                sub_options: subOptions
                                            });
                                        })
                                        /** End Set Option Names **/

                                        if (order?.isFirst && !isCancelInvoice) {
                                            invoiceFirstOrders.push({
                                                name: product.title,
                                                quantity: order.quantity,
                                                category: product.category,
                                                optionNames: optionNames,
                                            })
                                        } else {
                                            invoiceOrders.push({
                                                name: product.title,
                                                quantity: order.quantity,
                                                category: product.category,
                                                optionNames: optionNames,
                                            })
                                        }
                                        isThere = true;
                                    }
                                })
                                if (isThere) {
                                    order.isPrint = true;
                                    orderId.push(order._id);
                                }
                            }

                        }
                    }
                }

                if (orderId.length > 0) {
                    let resData = await Services.Put.orderPrint({tableId: table._id, orderId: orderId, status: true});
                    if (resData.status) {
                        isChange = true;
                        let section = self.state.globalData.Sections.findSingle("_id", table.section);
                        self.printKitchenInvoice(
                            invoiceOrders,
                            invoiceFirstOrders,
                            {
                                branch: (isCancelInvoice) ? self.props.router.t("cancel") : self.props.router.t("new-order"),
                                table: table.safeSales ? self.props.router.t('case-sale') : `${section.title} - ${table.title}`
                            }
                        );
                    }
                }
            }
        }

        async function invoiceTakeAway() {
            for (let takeAwayIndex = 0; takeAwayIndex < allTakeAway.length; takeAwayIndex++) {
                let invoiceData: any[] = [];
                let takeAway = allTakeAway[takeAwayIndex];
                let orderId: string[] = [];

                for (let orderIndex = 0; orderIndex < takeAway.products.length; orderIndex++) {
                    let order = takeAway.products[orderIndex];
                    if (typeof order.isPrint !== "undefined" && !order.isPrint) {
                        if (order.products) {
                            continue;
                        }
                        let product = clone(self.state.globalData.Products.findSingle("_id", order.productId));
                        if (product) {
                            let isThere = false;
                            LocalStorages.PrinterGroups.get.forEach(group => {
                                if (group.categories.includes(product.category)) {
                                    /** Set Option Names **/
                                    let optionNames: any[] = [];
                                    if (order.note) {
                                        optionNames.push({
                                            title: "Not",
                                            sub_options: [order.note]
                                        })
                                    }
                                    order.options.forEach((orderOption: any) => {
                                        let option = self.state.globalData.ProductOptions.findSingle("_id", orderOption.option_id);
                                        let subOptions: any[] = [];
                                        if (option && Array.isArray(option.items) && Array.isArray(orderOption.items)) {
                                            orderOption.items.forEach((orderOptionItem: any) => {
                                                let optionItem = option.items.findSingle("_id", orderOptionItem.item_id);
                                                if (optionItem) {
                                                    subOptions.push(optionItem.item_name);
                                                }
                                            })
                                        }
                                        optionNames.push({
                                            title: option.name,
                                            sub_options: subOptions
                                        });
                                    })
                                    /** End Set Option Names **/

                                    invoiceData.push({
                                        name: product.title,
                                        quantity: order.quantity,
                                        category: product.category,
                                        optionNames: optionNames,
                                    })
                                    isThere = true;
                                }
                            })
                            if (isThere) {
                                order.isPrint = true;
                                orderId.push(order._id);
                            }
                        }

                    }
                }

                if (orderId.length > 0) {
                    let resData = await Services.Put.homeDeliveryPrint({
                        checkId: takeAway._id,
                        orderId: orderId,
                        status: true
                    });
                    if (resData.status) {
                        isChange = true;
                        self.printKitchenInvoice(
                            invoiceData,
                            [],
                            {
                                invoiceName: self.props.router.t("take-away"),
                                address: takeAway.customer.address.address,
                                customer: takeAway.customer.full_name,
                                branch: LocalStorages.GeneralPrinter.get.name || "Digigarson",
                            }
                        );
                    }
                }
            }
        }

        await invoiceTable();
        await invoiceTable(true);
        await invoiceTakeAway();

        if (isChange) {
            this.setState((state: PageState) => {
                return {
                    globalData: Object.assign(state.globalData, {
                        AllTables: allTables,
                        AllTakeaway: allTakeAway
                    })
                };
            });
        }
        this.setInterval();
    }

    printKitchenInvoice(orders: any[], firstOrders: any[], subData: object) {

        const printData = {
            orders: orders.map((product) => ({
                ...product
            })),
            firstOrders: firstOrders,
            branch: getGlobalAuthData().user.branchTitle,
            ...subData
        };

        Printers.KitchenByGroup.printKitchenByGroup(printData);
    }

    setGlobalData(data: AppGlobalSetState["globalData"], callBack?: () => void) {
        this.setState((state: PageState) => {
            return {
                globalData: Object.assign(state.globalData, data)
            };
        }, () => {
            if (callBack) {
                callBack();
            }
        })
    }

    openModal(type: any, data?: any) {
        this.setState({
            modal: {
                isOpen: true,
                type: type,
                data: data,
            }
        });
    };

    closeModal() {
        this.setState({
            modal: {
                isOpen: false,
                type: null,
                data: null,
            }
        });
    }

    toggleState() {
        this.setState({
            isToggleState: !this.state.isToggleState
        })
    }

    setIsSetGlobalData(isSet: boolean, callBack?: () => void) {
        this.setState({
            isSetGlobalData: isSet
        }, () => {
            if (callBack) {
                callBack();
            }
        })
    }

    render() {
        if (this.state.isPageLoading) return <div className="caseClosed">{this.props.router.t("loading")}</div>;

        const commonProps: PagePropCommonDocument = {
            router: this.props.router,
            setGlobalData: (data, callBack) => this.setGlobalData(data, callBack),
            getGlobalData: clone(this.state.globalData),
            openModal: (type, data) => this.openModal(type, data),
            closeModal: () => this.closeModal(),
            toggleState: () => this.toggleState()
        };

        return (
            <Providers {...commonProps} isSetGlobalData={this.state.isSetGlobalData}
                       setIsSetGlobalData={(isSet, callback) => this.setIsSetGlobalData(isSet, callback)}>
                <Modals
                    {...this.state.modal}
                    {...commonProps}
                />
                <AppRoutes {...commonProps}/>
            </Providers>
        )
    }
}

export function withRouter(Component: any) {
    function ComponentWithRouterProp(props: any) {
        let location = useLocation();
        let navigate = useNavigate();
        let params = useParams();
        let searchParams = useSearchParams();
        const {t, i18n} = useTranslation();
        return (
            <Component
                {...props}
                router={{location, navigate, params, searchParams, t, i18n}}
            />
        );
    }

    return ComponentWithRouterProp;
}

export default withRouter(App);