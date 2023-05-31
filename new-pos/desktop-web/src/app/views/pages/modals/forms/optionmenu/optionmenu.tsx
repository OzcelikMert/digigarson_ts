import {Component} from "react";
import Swal from "sweetalert2";
import "./optionmenu.css";
import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import clone from "clone";
import PageOrder from "../../../orders";

type PageState = {
    selectedOptions: Array<any>;
    priceType: string;
    note: string;
    addCount: number
};

type PageProps = {
    data: PageOrder
} & PagePropCommonDocument;

class OptionMenu extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            selectedOptions: [],
            priceType: this.props.data.state.selectedProduct.prices[0]._id,
            note: "",
            addCount: this.props.data.state.multiplier
        };
    }

    handleSubmit(isAll?: boolean): void {
        let remainForcedChoice = false;
        this.props.data.state.selectedProduct.options.forEach((item: any) => {
            if (item.is_forced_choice) {
                let x = this.state.selectedOptions.find((opt: any) => opt.option_id == item.option_id);
                if (x == undefined) {
                    remainForcedChoice = true;
                    return;
                }
            }
        });
        if (remainForcedChoice) {
            Swal.fire({
                title: this.props.router.t("option-warning"),
                icon: "warning",
            });
        } else {
            let addCount = isAll ? this.state.addCount : 1;
            this.props.data.setNewOrderProduct(
                Object.assign(clone(this.props.data.state.selectedProduct), {options: this.state.selectedOptions}),
                addCount,
                true,
                this.state.note,
                this.state.priceType
            );
            if (
                isAll ||
                this.state.addCount === 1
            ) {
                this.props.closeModal();
            } else {
                this.setState((state: PageState) => {
                    state.addCount -= addCount;
                    return state;
                })
            }
        }
    }

    handleOptionSelect(option: any, item: any, isMulti: boolean): void {
        this.setState((state: PageState) => {
            let findIndex = state.selectedOptions.indexOfKey("option_id", option.option_id);
            if (findIndex > -1) {
                if (isMulti) {
                    let selectedOption = state.selectedOptions[findIndex];
                    let findIndexItem = selectedOption.linked.items.indexOfKey("_id", item._id);
                    if (findIndexItem > -1) {
                        selectedOption.linked.items.remove(findIndexItem);
                    } else {
                        if (selectedOption.linked.choose_limit > selectedOption.linked.items.length) {
                            selectedOption.linked.items.push(item);
                        } else {
                            Swal.fire({
                                title: this.props.router.t("max-product"),
                                icon: "error",
                            });
                        }
                    }
                } else {
                    state.selectedOptions[findIndex].linked.items = [item];
                }
            } else {
                option.linked.items = [item];
                state.selectedOptions.push(option);
            }
            return state;
        })
    }

    SelectedCount = (props: any) => {
        let findIndex = this.state.selectedOptions.indexOfKey("option_id", props.option_id);
        let count = findIndex > -1
            ? this.state.selectedOptions[findIndex].linked.items.length
            : 0
        return count.toString();
    }

    OptionItem = (props: any) => {
        return (
            <div
                className="option"
                style={{
                    minWidth: "5vw",
                    backgroundColor: props.bgColor,
                    textAlign: "center"
                }}
                onClick={props.onClick}
            >{props.itemName} {props.price != 0 ? `(${props.price < 0 ? `-` : `+`}${props.price})` : ``}</div>
        );
    }

    Option = (props: any) => {
        console.log(props);
        return (
            <div className="optionContainer">
                <div className="optionName">
                    {props.option.linked.name}
                    {props.option.is_forced_choice ? (
                        <span style={{color: "red"}}>*</span>
                    ) : null}
                    <span style={{color: "blue"}}>
                        {<this.SelectedCount option_id={props.option.option_id}/>}/{props.option.linked.choose_limit}
                    </span>
                </div>
                {
                    props.option.linked.items.map((item: any) =>
                        <this.OptionItem
                            itemName={item.item_name}
                            price={item.price}
                            bgColor={this.getColor(props.option, item)}
                            onClick={() => this.handleOptionSelect(props.option, item, props.option.linked.type == 2)}
                        />
                    )}
            </div>
        )
    }

    getColor = (option: any, item: any) => {
        let color = "red";
        let find = this.state.selectedOptions.findSingle("option_id", option.option_id);
        if (find) {
            if (find.linked.items.findSingle("_id", item._id)) {
                color = "green";
            }
        }
        return color;
    };

    render() {
        return (
            <div className="optionmenu">
                <div className="optionNote">
                    {
                        this.props.data.state.selectedProduct.sale_type == 5
                            ? (
                                <>
                                    <span>{this.props.router.t("portion")}</span>
                                    <div>
                                        {
                                            this.props.data.state.selectedProduct.prices.map((price: any) => (
                                                <button
                                                    className="option"
                                                    style={{
                                                        minWidth: "5vw",
                                                        backgroundColor: this.state.priceType == price._id ? "green" : "blue",
                                                        textAlign: "center"
                                                    }}
                                                    onClick={(event: any) => this.setState({priceType: event?.target.value})}
                                                    value={price._id}
                                                > {price.price_name} {price.price} TL </button>
                                            ))
                                        }
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>{this.props.router.t("price")}</span>
                                    <select onChange={(event: any) => this.setState({priceType: event?.target.value})}>
                                        {
                                            this.props.data.state.selectedProduct.prices.map((price: any) => (
                                                <option value={price._id}>
                                                    {price.price_name} {price.price} TL
                                                </option>
                                            ))
                                        }
                                    </select>
                                </>
                            )
                    }
                    <span>{this.props.router.t("note")}</span>
                    <input
                        value={this.state.note}
                        onChange={(event: any) => this.setState({note: event?.target.value})}
                    />
                    <div
                        onClick={() => this.setState({note: ""})}
                        className="clearButton"
                    >
                        {this.props.router.t("clear")}
                    </div>
                    <div onClick={() => this.handleSubmit()} className="submitOption">
                        {this.props.router.t("add")} ({this.state.addCount})
                    </div>
                    <div onClick={() => this.handleSubmit(true)} className="submitOption">
                        {this.props.router.t("all")}
                    </div>
                </div>
                <div>
                    <span className="optionTitle">{this.props.router.t("option")}</span>
                    <div className="optionList">
                        {
                            clone(this.props.data.state.selectedProduct.options).map((option: any) =>
                                <this.Option
                                    option={option}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default OptionMenu;
