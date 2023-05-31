import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {Component} from "react";

type PageState = {
    time: any;
};

type PageProps = {
    tableTitle: string
    sectionTitle: string
    createdAt: string
    updatedAt: string
    onClick: any
    isSelected: boolean
    isBusy: boolean
    isPrinted: boolean
    router: PagePropCommonDocument["router"]
};

class Table extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            time: new Date()
        };
    }

    getBgColor = () => {
        if (this.props.isSelected) {
            return "brown";
        } else if (this.props.isBusy) {
            if (this.props.isPrinted) {
                return "blue";
            }
            if (this.state.time - new Date(this.props.updatedAt).getTime() > 2700000) {
                return "orange";
            }
            return "green";
        } else {
            return "#485563";
        }
    };

    getTime = (iso: any) => {
        let locale = new Date(iso).toLocaleTimeString("tr").split(":");
        return locale[0] + ":" + locale[1];
    };

    render() {
        return (
            <article
                style={{
                    backgroundColor: this.getBgColor(),
                    left: 5,
                    top: 5,
                }}
                onClick={this.props.onClick}
            >
                <div className="in">
                    <div className="tableTitle">
                        <span>
                            {
                                this.props.isSelected
                                    ? this.props.router.t("cancel")
                                    : this.props.tableTitle

                            }
                        </span>
                    </div>
                    <div>
                        <span>
                            {
                                this.props.isSelected
                                    ? "_"
                                    : this.props.sectionTitle
                            }
                        </span>
                    </div>
                    <div className="tableDate">
                        <span>{this.getTime(this.props.createdAt)}</span>
                        <span>{this.getTime(this.props.updatedAt)}</span>
                    </div>
                </div>
            </article>
        );
    }
}

export default Table;
