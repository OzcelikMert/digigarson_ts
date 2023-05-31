import FuzzySearch from "fuzzy-search";
import {Component} from "react";
import {MODAL} from "constants/modalTypes";
import "./cost.css";
import {payment_types} from "constants/paymentTypes";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import Swal from "sweetalert2";
import Services from "services/index";
import {CostDeleteParamDocument} from "../../../../../../modules/services/cost";

type PageState = {
    title: Array<any>;
    cost: any[]
    showingCost: any[]
};

type PageProps = {
    data: any
} & PagePropCommonDocument;

class Cost extends Component<PageProps, PageState> {
    today = new Date().toLocaleDateString();

    constructor(props: any) {
        super(props);
        this.state = {
            title: [],
            cost: [],
            showingCost: []
        };
    }

    componentDidMount(){
        this.sets();
    }

    sets(){
        let getCosts = Services.Get.costs().data;

        this.setState({
            cost: getCosts,
            showingCost: getCosts
        })
    }

    createCost() {
        this.props.openModal(MODAL.CREATE_COST, this);
    }

    deleteCost(costId: string) {
        Swal.fire({
            icon: "question",
            title: this.props.router.t("delete-cost-question"),
            showCancelButton: true,
        }).then((result) => {
            let params: CostDeleteParamDocument = {
                expenseId: costId
            };
            if (result.isConfirmed) {
                Services.Delete.cost(params).then(resData => {
                    if (resData.status) {
                        this.setState((state) => {
                            let findIndex = this.state.cost.indexOfKey("id", costId);
                            if (findIndex > -1) {
                                this.state.cost.remove(findIndex);
                            }
                            return state;
                        }, () => {
                            Swal.fire({
                                icon: "success",
                                title: this.props.router.t("delete-cost-success"),
                            });
                        })
                    }
                })
            }
        });
    }

    searchCost(event: any, type: string) {
        const costSearcher = new FuzzySearch(this.state.cost, [type], {
            caseSensitive: false,
        });
        const result = costSearcher.search(event.target.value.trim());

        this.setState({
            showingCost: result
        })
    };

    render() {
        return (
            <div className="Home-cost">
                <div className="show-all">
                    <div className="company-operations-cost">
                        <button onClick={() => this.createCost()}>
                            {this.props.router.t("add-cost")}
                        </button>
                    </div>
                    <div className="search-cost">
                        <table>
                            <thead>
                            <tr>
                                <th>{this.props.router.t("description")}</th>
                                <th>{this.props.router.t("price")}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                {["title", "expense_amount"].map((type: string) => (
                                    <td>
                                        <input
                                            style={{color: "black", borderRadius: "16px"}}
                                            onChange={(event) => this.searchCost(event, type)}
                                        />
                                    </td>
                                ))}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="show-costs">
                        <table>
                            <thead>
                            <tr>
                                <th style={{width: "17vw"}}>
                                    {this.props.router.t("explanation")}
                                </th>
                                <th style={{width: "14vw"}}>
                                    {this.props.router.t("payment-type")}
                                </th>
                                <th style={{width: "10vw"}}>
                                    {this.props.router.t("price")}
                                </th>
                                <th style={{width: "15vw"}}>
                                    {this.props.router.t("date")}
                                </th>
                                <th style={{width: "15vw"}}></th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.showingCost.map((cost: any) =>
                                    this.today ===
                                    new Date(cost?.createdAt).toLocaleDateString() ? (
                                        <tr style={{color: "black"}}>
                                            <th style={{width: "17vw"}}>{cost.title}</th>
                                            <th style={{width: "14vw"}}>
                                                {payment_types[cost.expense_type - 1]}
                                            </th>
                                            <th style={{width: "10vw"}}>
                                                {cost.expense_amount} {cost.currency}
                                            </th>
                                            <th style={{width: "15vw"}}>
                                                {new Date(cost?.createdAt).toLocaleDateString()}
                                            </th>
                                            <th style={{width: "15vw"}}>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => this.deleteCost(cost.id)}
                                                >
                                                    {this.props.router.t("delete")}
                                                </button>
                                            </th>
                                        </tr>
                                    ) : (
                                        <tr></tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cost;