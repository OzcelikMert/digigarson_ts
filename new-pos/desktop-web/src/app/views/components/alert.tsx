import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {Component} from "react";
import UString from "utilities/string";

type PageProps = {
    type: Type;
    className?: string;
} & PagePropCommonDocument;

export type Type = "primary" | "secondary" | "success" | "danger" | "warning";
type PageState = {};

class Alert extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    getBackgroundColor(type: Type = "primary"): string {
        switch (type) {
            case "primary":
                return "bg-blue-100";
            case "secondary":
                return "bg-gray-100";
            case "success":
                return "bg-green-100";
            case "danger":
                return "bg-red-100";
            case "warning":
                return "bg-yellow-100";

            default:
                return "bg-blue-100";
        }
    }

    getTextColor(type: Type = "primary"): string {
        switch (type) {
            case "primary":
                return "text-blue-900";
            case "secondary":
                return "text-gray-900";
            case "success":
                return "text-green-900";
            case "danger":
                return "text-red-900";
            case "warning":
                return "text-yellow-900";

            default:
                return "text-blue-900";
        }
    }

    getBorderColor(type: Type = "primary"): string {
        switch (type) {
            case "primary":
                return "border-blue-200";
            case "secondary":
                return "border-gray-200";
            case "success":
                return "border-green-200";
            case "danger":
                return "border-red-200";
            case "warning":
                return "border-yellow-200";

            default:
                return "border-blue-200";
        }
    }

    render() {
        return (
            <div
                className={UString.concat_class_name(
                    this.props?.className,
                    `py-3 px-5 ${this.getBackgroundColor(
                        this.props.type
                    )} ${this.getTextColor(
                        this.props.type
                    )} rounded-md border ${this.getBorderColor(this.props.type)}`
                )}
                role="alert"
            >
                {this.props.children}
            </div>
        );
    }
}

export default Alert;
