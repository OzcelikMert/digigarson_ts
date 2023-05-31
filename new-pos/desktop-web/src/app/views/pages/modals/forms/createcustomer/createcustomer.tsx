import "./createcustomer.css";
import IntlTelInput from "react-intl-tel-input";
import "react-intl-tel-input/dist/main.css";
import Swal from "sweetalert2";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {Component} from "react";
import Services from "../../../../../../services/index";
import {getGlobalAuthData} from "config/global";

interface ICustomer {
    title: string;
    address: IAdress;
    description: string;
    credit_amount: string;
    gsm_no: string;
    currency: string;
}

interface IAdress {
    title: string;
    address: string;
}

export interface IPhone {
    isValid: boolean;
    number: string;
    country: any;
}

type PageProps = {} & PagePropCommonDocument;

type PageState = {
    customer: ICustomer;
    phone: IPhone;
};

class Createcustomer extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            customer: {
                title: "",
                address:
                    {
                        address: "",
                        title: "",
                    },
                description: "",
                credit_amount: "0",
                gsm_no: "",
                currency: "TL",
            },
            phone: {
                isValid: false,
                number: "",
                country: "",
            },
        };
    }

    handleChange(value: string, type: string) {
        let temp = JSON.parse(JSON.stringify(this.state.customer));
        switch (type) {
            case "title":
                temp.title = value;
                break;
            case "address-title":
                temp.address.title = value;
                break;
            case "address":
                temp.address.address = value;
                break;
            case "description":
                temp.description = value;
                break;
            case "credit":
                temp.credit_amount = value;
                break;
            default:
                break;
        }
        this.setState({
            customer: temp,
        });
    }

    handleSave() {
        let data: any = this.state.customer;
        console.log(data);
        if (data.description.replace(/\s/g, "").length < 3) {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("error-customer-description"),
            });
        } else if (
            data.title.replace(/\s/g, "").length > 0 &&
            data.description.replace(/\s/g, "").length > 0 &&
            data.address.address.replace(/\s/g, "").length > 0 &&
            data.address.title.replace(/\s/g, "").length > 0
        ) {
            if (this.state.phone.isValid) {
                data.gsm_no = this.state.phone.number.replace(/\s/g, "");
                Services.Post.customers(data).then(res => {
                    if (res.status) {
                        data.address = [data.address]
                        this.props.setGlobalData({
                            AllCustomers: this.props.getGlobalData.AllCustomers.concat({
                                ...data,
                                branch: getGlobalAuthData().user.branchId,
                                id: res.data.id
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
                    title: this.props.router.t("valid-phone"),
                });
            }
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
                this.props.closeModal();
            }
        });
    }

    render() {
        return (
            <div className="create-customer">
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "11.6vw"}}>{this.props.router.t("phone")}</div>
                    <div style={{width: "46vw", paddingBottom: "0.5vw"}}>
                        <IntlTelInput
                            preferredCountries={["tr"]}
                            format={true}
                            telInputProps={{
                                maxLength: 14,
                            }}
                            value={this.state.phone?.number}
                            onPhoneNumberChange={(isValid, number, country) => {
                                this.setState({
                                    phone: {isValid, number, country},
                                });
                            }}
                            style={{color: "black", width: "100%"}}
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "11vw"}}>
                        {this.props.router.t("customer-name")}
                    </div>
                    <div style={{width: "46vw", paddingBottom: "0.5vw"}}>
                        <input
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "title")
                            }
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "11vw"}}>
                        {this.props.router.t("customer-loan")}
                    </div>
                    <div style={{width: "46vw", paddingBottom: "0.5vw"}}>
                        <input
                            min={0}
                            type={"number"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "credit")
                            }
                            value={this.state.customer.credit_amount}
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "11vw"}}>
                        {this.props.router.t("address-title")}
                    </div>
                    <div style={{width: "46vw", paddingBottom: "0.5vw"}}>
                        <input
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "address-title")
                            }
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "11.6vw"}}>{this.props.router.t("address")}</div>
                    <div style={{width: "46vw", paddingBottom: "0.5vw"}}>
            <textarea
                style={{width: "100%"}}
                onChange={(event) =>
                    this.handleChange(event?.target.value, "address")
                }
            />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
                    className="row"
                >
                    <div style={{width: "11.6vw"}}>{this.props.router.t("note")}</div>
                    <div style={{width: "46vw", paddingBottom: "0.5vw"}}>
            <textarea
                style={{width: "100%"}}
                onChange={(event) =>
                    this.handleChange(event?.target.value, "description")
                }
            />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw"}}
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

export default Createcustomer;
