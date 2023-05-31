import {Component, FormEvent, FormEventHandler} from "react";
import {PagePropCommonDocument} from "../../../modules/views/pages/pageProps";
import {Formik} from "formik";
import Services from "services/index";
import HandleForm from "../../../library/react/handles/form";

type PageState = {
    formData: {
        amount: number
    }
}

type PageProps = {} & PagePropCommonDocument


class NewCase extends Component<PageProps, PageState> {
    constructor(props: PageProps) {
        super(props);
        this.state = {
            formData: {
                amount: 0
            }
        }
    }

    onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        Services.Post.case({
            start_balance: [
                {
                    type: 1,
                    amount: this.state.formData.amount,
                    currency: "TL"
                }
            ]
        }).then(resData => {
            console.log(resData);
            if (resData.status) {
                window.location.href = "/";
            }
        })
    }

    render() {
        return (
            <div className="Home">
                <div className="OpenCase">
                    <form className="form" onSubmit={(e) => this.onSubmit(e)}>
                        <div className="caseClosed">{this.props.router.t("open-case-description")}</div>
                        <input
                            type="number"
                            name="amount"
                            value={this.state.formData.amount}
                            onChange={e => HandleForm.onChangeInput(e, this)}
                        />
                        <button className="button" type="submit">{this.props.router.t("open-case")}</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default NewCase;