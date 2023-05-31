import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import React, {Component} from "react";

type PageState = {
    date: any;
};

type PageProps = {} & PagePropCommonDocument;

class DateTime extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            date: new Date,
        };
    }

    sets() {
        var timer = setInterval(() =>
            this.setState({
                date: (new Date(), 1000),
            })
        );
        return function cleanup() {
            clearInterval(timer);
        };
    }

    render() {
        return (
            <div>
                <p>
                    {" "}
                    {this.props.router.t("hour")} : {this.state.date.toLocaleTimeString()}
                </p>
                <p>
                    {" "}
                    {this.props.router.t("date")} : {this.state.date.toLocaleDateString()}
                </p>
            </div>
        );
    }
}

export default DateTime;
