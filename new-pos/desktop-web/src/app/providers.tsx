import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {Component} from "react";
import {Navigate} from "react-router-dom";
import {getGlobalAuthData, GlobalLocalStorages, GlobalStates, setGlobalAuthData,} from "../config/global";
import V from "../library/variable";
import {JsonWebToken} from "utilities/jwt";
import NewCase from "./views/components/newCase";
import Services from "services/index";
import Thread from "../library/thread";

type PageState = {
    isAuth: boolean,
    isPageLoading: boolean
};

type PageProps = {
    isSetGlobalData: boolean
    setIsSetGlobalData: (isSet: boolean, callback?: () => void) => void
} & PagePropCommonDocument;

class Providers extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isAuth: false,
            isPageLoading: true
        }
    }

    componentDidMount() {
        this.onRouteChanged();
    }

    componentDidUpdate(prevProps: Readonly<PageProps>) {
        if (this.props.router.location.pathname !== prevProps.router.location.pathname) {
            this.onRouteChanged();
        }
    }

    private onRouteChanged() {
        this.setState({
            isPageLoading: true,
        }, () => {
            this.setState({
                isAuth: this.checkSession() && getGlobalAuthData().user.branch_custom_id > 0
            }, () => {
                if (this.state.isAuth && !this.props.isSetGlobalData) {
                    this.setGlobalData().then(value => {
                        console.log("aa")
                        this.setState({
                            isPageLoading: false
                        })
                    })
                } else {
                    this.setState({
                        isPageLoading: false
                    })
                }
            })
        })
    }

    setGlobalData() {
        return new Promise(resolve => {
            Thread.start(() => {
                let caseResData = Services.Get.case({});
                if (caseResData.status) {
                    if (caseResData.data._id) {
                        const branchAllData = Services.Get.myBranch().data;
                        this.props.setGlobalData({
                            caseId: caseResData.data._id,
                            Categories: branchAllData.categories,
                            Products: branchAllData.products,
                            ProductOptions: branchAllData.options,
                            AllTables: Services.Get.allTablesSync().data,
                            Sections: branchAllData.sections,
                            Ticks: Services.Get.tick({}).data,
                            AllCourier: Services.Get.couriers().data,
                            AllCustomers: Services.Get.customers().data,
                            AllTakeaway: Services.Get.takeawaySync().data
                        }, () => {
                            this.props.setIsSetGlobalData(true, () => {
                                resolve(1)
                            });
                        });
                    } else {
                        resolve(1)
                    }
                } else {
                    resolve(1)
                }
            })
        })
    }

    checkSession(): boolean {
        if (!V.isEmpty(GlobalLocalStorages.Token.get.access)) {
            setGlobalAuthData({
                tokens: {
                    access: GlobalLocalStorages.Token.get.access,
                    refresh: GlobalLocalStorages.Token.get.refresh
                },
                user: JsonWebToken.parse(GlobalLocalStorages.Token.get.access)
            })
            return true;
        }

        GlobalLocalStorages.Token.delete();
        GlobalLocalStorages.User.delete();
        return false;
    }

    render() {
        if (!Boolean(window.require)) return (<div className="text-center">dunno, where are you?</div>);
        if (this.state.isPageLoading) return (<div className="caseClosed">{this.props.router.t("loading")}</div>);

        return (!this.state.isAuth && !this.props.router.location.pathname.endsWith("sign-in"))
            ? <Navigate to="/sign-in"/>
            : (this.state.isAuth && this.props.router.location.pathname.endsWith("sign-in"))
                ? <Navigate to="/"/>
                : (!this.state.isAuth && this.props.router.location.pathname.endsWith("sign-in")) || this.props.getGlobalData.caseId
                    ? this.props.children
                    : <NewCase {...this.props}/>

    }
}

export default Providers;
