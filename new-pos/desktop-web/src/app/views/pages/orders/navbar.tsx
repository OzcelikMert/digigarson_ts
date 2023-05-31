import {Button, Input} from "antd";
import {ArrowLeftOutlined} from "@ant-design/icons";
import {Component} from "react";
import {FaSearch} from "react-icons/fa";
import Swal from "sweetalert2";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {GlobalStates} from "config/global";

type PageState = {
    user: any;
    date: any;
    val: number;
    opt: string;
};

type PageProps = {
    newOrders: any[]
    multiplier: number,
    onClickMultiplier: any
    onSearchProduct: any
    onSearchCategory: any
} & PagePropCommonDocument;

class Navbar extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            user: "",
            date: new Date(),
            val: 1,
            opt: "C",
        };
    }

    sets() {
        const setTimer = () => {
            var timer = setInterval(() =>
                this.setState({
                    date: (new Date(), 1000),
                })
            );
            return function cleanup() {
                clearInterval(timer);
            };
        };

        setTimer();
    }

    handleMultiplier(value: any): void {
        let multiplier = value;
        switch (value) {
            case "X":
                this.setState({
                    opt: value,
                });
                break;
            case "C":
                multiplier = 1;
                this.setState({
                    val: 1,
                    opt: value,
                });
                break;
            default:
                if (this.state.opt == "X") {
                    multiplier = multiplier * value;
                } else {
                    multiplier = value;
                }
                this.setState({
                    opt: "C",
                });
                break;
        }
        this.props.onClickMultiplier(multiplier);
    }

    handleReturn(): void {
        GlobalStates.Type = "";
        if (
            GlobalStates.CurrentTable.isSafeSales &&
            this.props.newOrders.length > 0
        ) {
            Swal.fire({
                icon: "warning",
                title: this.props.router.t("payment-cashier"),
            });
            return;
        }

        if (this.props.newOrders.length > 0) {
            Swal.fire({
                icon: "question",
                title: this.props.router.t("product-return"),
                showCancelButton: true,
            }).then((result: any) => {
                if (result.isConfirmed) {
                    GlobalStates.SelectedTableId = "";
                    this.props.router.navigate("/", {replace: true});
                }
            });
        } else {
            GlobalStates.SelectedTableId = "";
            this.props.router.navigate("/", {replace: true});
        }
    }

    productOnclick(event: any): void {
        throw new Error("Function not implemented.");
    }

    render() {
        return (
            <>
                <div className="row">
                    <div className="col">
                        <Button
                            onClick={() => this.handleReturn()}
                            className="dg-back-button"
                            type="primary"
                            icon={<ArrowLeftOutlined/>}
                        />
                        <Button className="dg-title-explain" type="primary">
                            {this.state.user?.name}
                        </Button>
                    </div>
                    <div className="col">
                        <Button
                            onClick={() => this.handleMultiplier(2)}
                            className="dg-nonepad"
                        >
                            2
                        </Button>
                        <Button
                            onClick={() => this.handleMultiplier(3)}
                            className="dg-nonepad"
                        >
                            3
                        </Button>
                        <Button
                            onClick={() => this.handleMultiplier(4)}
                            className="dg-nonepad"
                        >
                            4
                        </Button>
                        <Button
                            onClick={() => this.handleMultiplier(5)}
                            className="dg-nonepad"
                        >
                            5
                        </Button>
                        <Button
                            onClick={() => this.handleMultiplier("X")}
                            className="dg-nonepad dg-nonepad-op"
                        >
                            X
                        </Button>
                        <Button
                            onClick={() => this.handleMultiplier("C")}
                            className="dg-nonepad dg-nonepad-del"
                        >
                            C
                        </Button>
                        <Button className="dg-nonepadNumber dg-nonepad dg-nonepad-sum ">
                            {this.props.multiplier}
                        </Button>
                    </div>
                    <div className="col" style={{width: "35%"}}>
                        <Input
                            disabled
                            className="dg-date"
                            placeholder={
                                this.state.date.toLocaleDateString() +
                                "   | " +
                                this.state.date.toLocaleTimeString()
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col" style={{display: "block"}}>
                        <div className="adisyon-label">
                            <div className="label-text">{this.props.router.t("ticket")}</div>
                        </div>
                    </div>
                    <div className="col" style={{display: "block"}}>
                        <div className="adisyon-label">
                            <div className="label-text">
                                {GlobalStates.SelectedCourier == -1
                                    ? this.props.router.t("courier-name")
                                    : this.props.router.t("product-name")}
                            </div>
                            <div className="searchbar">
                                <button className="searchbar-button">
                                    <FaSearch/>
                                </button>
                                <input
                                    onChange={(event) => this.props.onSearchProduct(event.target.value)}
                                    className="searchbar-input"
                                    placeholder={this.props.router.t("search")}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col" style={{display: "block", width: "35%"}}>
                        <div className="adisyon-label">
                            <div className="label-text">
                                {this.props.router.t("categories")}
                            </div>
                            <div className="searchbar">
                                <button className="searchbar-button">
                                    <FaSearch/>
                                </button>
                                <input
                                    className="searchbar-input"
                                    onChange={(event) => this.props.onSearchCategory(event.target.value)}
                                    placeholder={this.props.router.t("search")}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Navbar;
