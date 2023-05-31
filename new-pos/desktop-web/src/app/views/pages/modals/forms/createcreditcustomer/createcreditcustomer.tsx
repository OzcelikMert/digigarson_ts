import "./createcreditcustomer.css";
import Swal from "sweetalert2";
import {Component} from "react";
import {PagePropCommonDocument} from "../../../../../../modules/views/pages/pageProps";
import Services from "../../../../../../services/index";
import {getGlobalAuthData} from "config/global/auth";

interface Discount {
    type: number;
    price: number;
}

interface Tick {
    name: string;
    phoneNum: number;
    taxAdmin: string;
    taxNum: number;
    discount: Discount[];
}

type PageState = {
    tick: Tick;
};

type PageProps = {
    data: any
} & PagePropCommonDocument;

class Createcreditcustomer extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            tick: {
                name: "",
                phoneNum: 0,
                taxAdmin: "",
                taxNum: 0,
                discount: [
                    {
                        type: 0,
                        price: 0,
                    },
                ],
            },
        };
    }

    handleChange(value: string, type: string) {
        let temp = JSON.parse(JSON.stringify(this.state.tick));
        switch (type) {
            case "name":
                temp.name = value;
                break;
            case "phone-number":
                temp.phoneNum = value;
                break;
            case "discount":
                temp.discount[0].price = value;
                break;
            default:
                temp.discount[0].type = value == "percent" ? 0 : 1;
                break;
        }
        this.setState({
            tick: temp,
        });
    }

    handleSave() {
        let data = {
            name: this.state.tick.name,
            phoneNum: this.state.tick.phoneNum,
            taxAdmin: this.state.tick.taxAdmin,
            taxNum: this.state.tick.taxNum,
        };
        if (
            data.name.replace(/\s/g, "").length > 0 &&
            data.phoneNum.toString().replace(/\s/g, "").length > 0
        ) {
            Services.Post.tick(data).then(result => {
                if (result.status) {
                    this.props.setGlobalData({
                        Ticks: this.props.getGlobalData.Ticks.concat({
                            ...data,
                            branch: getGlobalAuthData().user.branchId,
                            id: result.data._id
                        })
                    }, () => {
                        this.props.closeModal();
                        Swal.fire({
                            icon: "success",
                            title: this.props.router.t("customer-success"),
                        });
                    })
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("fill-fields"),
            });
        }
    }

    handleCancel() {
        Swal.fire({
            icon: "question",
            title: this.props.router.t("cancel-question"),
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.closeModal()
            }
        });
    }

    render() {
        return (
            <div className="create-credit-customer">
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "2vw"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>
                        {this.props.router.t("customer-name")}
                    </div>
                    <div style={{width: "80%"}}>
                        <input
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "name")
                            }
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>{this.props.router.t("phone")}</div>
                    <div style={{width: "80%"}}>
                        <input
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "phone-number")
                            }
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>{this.props.router.t("discount")}</div>
                    <div style={{width: "80%", textAlign: "center"}}>
                        <input
                            style={{marginRight: "1vw"}}
                            min={0}
                            type={"number"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "discount")
                            }
                        />
                        <div>
                            <div
                                style={{
                                    marginRight: "1vw",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                    alignItems: "center",
                                    backgroundColor:
                                        this.state.tick.discount[0].type == 0
                                            ? "red"
                                            : "rgb(70, 0, 0)",
                                }}
                                onClick={() => this.handleChange("percent", "discount-type")}
                            >
                                %
                            </div>
                            <div
                                style={{
                                    color: "white",
                                    alignItems: "center",
                                    textAlign: "center",
                                    fontSize: "1.05vw",
                                    backgroundColor:
                                        this.state.tick.discount[0].type == 1
                                            ? "red"
                                            : "rgb(70, 0, 0)",
                                    wordWrap: "break-word",
                                    whiteSpace: "nowrap",
                                    wordBreak: "break-word",
                                }}
                                onClick={() => this.handleChange("amount", "discount-type")}
                            >
                                {this.props.router.t("quantity")}
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "1vw"}}
                    className="row"
                >
                    <div
                        onClick={() => this.handleSave()}
                        style={{height: "6vh", fontSize: "large"}}
                        className="btn btn-success"
                    >
                        {this.props.router.t("submit")}
                    </div>
                    <div
                        onClick={() => this.handleCancel()}
                        style={{height: "6vh", fontSize: "large"}}
                        className="btn btn-danger"
                    >
                        {this.props.router.t("cancel")}
                    </div>
                </div>
            </div>
        );
    }
}

export default Createcreditcustomer;
