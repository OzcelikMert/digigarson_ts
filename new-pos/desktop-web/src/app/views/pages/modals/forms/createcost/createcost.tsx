import "./createcost.css";
import Swal from "sweetalert2";
import {Component} from "react";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Services from "../../../../../../services/index";
import {getGlobalAuthData} from "config/global";

interface ICost {
    title: string;
    expense_type: number;
    currency: string;
    expense_amount: number;
    description: string;
    expense_time: Date;
}

type PageState = {
    cost: ICost;
    costs: any
};

type PageProps = {
    data: any
} & PagePropCommonDocument;

class CreateCost extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            cost: {
                title: "",
                expense_type: 1,
                currency: "TL",
                expense_amount: 0,
                description: "",
                expense_time: new Date(),
            },
            costs:[]
        };
    }

    componentDidMount(){
        this.sets();
    }

    sets(){
        let getCosts = Services.Get.costs().data;

        this.setState({
            costs: getCosts
        })
    }

    handleChange = (value: string, type: string) => {
        let temp = JSON.parse(JSON.stringify(this.state.cost));
        switch (type) {
            case "title":
                temp.title = value;
                break;
            case "cost-amount":
                temp.expense_amount = value;
                break;
            case "cost-type":
                temp.expense_type = value;
                break;
            case "description":
                temp.description = value;
                break;
            default:
                break;
        }
        this.setState({
            cost: temp
        })
    };

    handleSave = () => {
        let data: any = this.state.cost;
        if (data.description.replace(/\s/g, "").length < 10) {
            Swal.fire({
                icon: "error",
                title: this.props.router.t("error-cost-description"),
            });
        } else if (
            data.title.replace(/\s/g, "").length > 0 &&
            data.description.replace(/\s/g, "").length > 0
        ) {
            Services.Post.costs(data).then((result) => {
                if (result.status) {
                    this.setState((state) => { 
                        state.costs.concat([
                            {
                                ...data,
                                branch: getGlobalAuthData().user.branchId,
                                createdAt: new Date(),
                                id: result.data.id
                            }
                        ])
                        return state;
                    }, () => {
                        this.props.closeModal();
                        Swal.fire({
                            icon: "success",
                            title: this.props.router.t("cost-success"),
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
    };
    handleCancel = () => {
        Swal.fire({
            icon: "question",
            title: this.props.router.t("cancel-question"),
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                this.props.closeModal();
            }
        });
    };

    render() {
        return (
            <div className="create-credit-customer">
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "2vw"}}
                    className="row"
                >
                    <div style={{width: "20%", alignItems: "center"}}>
                        {this.props.router.t("cost-name")}
                    </div>
                    <div style={{width: "80%"}}>
                        <input
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "title")
                            }
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", marginTop: "5px"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>
                        {this.props.router.t("cost-amount")}
                    </div>
                    <div style={{width: "80%"}}>
                        <input
                            style={{width: "10vw"}}
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "cost-amount")
                            }
                        />
                        <div>
                            <div style={{marginLeft: "19px", alignItems: "center"}}>
                                {this.props.router.t("payment-type")}
                            </div>
                            
                            <select onChange={(event) =>this.handleChange(event?.target.value, "cost-type")}>
                                <option value={1}>{this.props.router.t("credit-card")}</option>
                                <option value={2}>{this.props.router.t("cash")}</option>
                                <option value={3}>{this.props.router.t("app_payment")}</option>
                                <option value={4}>Hizmet</option>
                                <option value={5}>İskonto</option>
                                <option value={6}>Veresiye</option>                       
                            </select>
                        </div>
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", marginTop: "5px"}}
                    className="row"
                >
                    <div style={{width: "20%"}}>
                        {this.props.router.t("cost-description")}
                    </div>
                    <div style={{width: "80%"}}>
                        <input
                            type={"text"}
                            onChange={(event) =>
                                this.handleChange(event?.target.value, "description")
                            }
                        />
                    </div>
                </div>
                <div
                    style={{paddingLeft: "1vw", paddingRight: "1vw", paddingTop: "1vw"}}
                    className="row"
                >
                    <div
                        onClick={() => this.handleSave()}
                        style={{height: "6vh", fontSize: "large", paddingTop: "1.3vh"}}
                        className="btn btn-success"
                    >
                        {this.props.router.t("submit")}
                    </div>
                    <div
                        onClick={() => this.handleCancel()}
                        style={{height: "6vh", fontSize: "large", paddingTop: "1.3vh"}}
                        className="btn btn-danger"
                    >
                        {this.props.router.t("cancel")}
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateCost;
