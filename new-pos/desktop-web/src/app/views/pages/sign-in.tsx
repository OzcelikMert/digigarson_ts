import {Component, FormEvent} from "react";
import {PagePropCommonDocument} from "../../../modules/views/pages/pageProps";
import {
    setGlobalAuthData,
    GlobalLocalStorages,
    getGlobalAuthData
} from "../../../config/global";
import Services from "../../../services/index";

type PageState = {
    focusElement: any,
    keyboardOn: boolean,
    error: string,
    formData: {
        branchId: string,
        password: string
    }
};

type PageProps = {} & PagePropCommonDocument;

class PageSignIn extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
        this.state = {
            focusElement: "",
            keyboardOn: false,
            error: "",
            formData: {
                branchId: "",
                password: ""
            }
        };
    }

    from = (this.props.router.location.state as any)?.from?.pathname || "/";

    sets() {
        const keyboard = (): void => {
            window.addEventListener("click", (e: any) => {
                if (e.target.tagName === "INPUT") {
                    this.setState({
                        keyboardOn: true,
                    });
                } else {
                    if (this.hasSomeParentTheClass(e.target, "keyboard")) {
                        this.setState({
                            keyboardOn: true,
                        });
                    } else {
                        this.setState({
                            keyboardOn: false,
                        });
                    }
                }
            });
        };

        const focusElement = (): void => {
            window.addEventListener("focusin", (e: any) => {
                if (e.target.tagName === "INPUT") {
                    this.setState({
                        keyboardOn: true,
                        focusElement: e.target,
                    });
                } else {
                    this.setState({
                        keyboardOn: false,
                    });
                }
            });
        };

        keyboard();
        focusElement();
    }

    hasSomeParentTheClass(element: any, classname: any): boolean {
        if (element.className?.split(" ").indexOf(classname) >= 0) return true;
        return (
            element.parentNode &&
            this.hasSomeParentTheClass(element.parentNode, classname)
        );
    }

    onChange = (input: any, setFieldValue: any) => {
        if (document.activeElement) {
            const activeElement = document.activeElement as HTMLInputElement;

            if (activeElement.tagName === "INPUT") {
                this.setState({
                    focusElement: document.activeElement,
                });
                if (!(typeof activeElement.value === "string")) return;
                if (this.state.focusElement === false) {
                    activeElement.value = input;
                } else {
                    this.state.focusElement.value = input;
                }
            } else {
                this.setState({
                    keyboardOn: true,
                });
                this.state.focusElement.value = input;
            }

            setFieldValue(
                this.state.focusElement.name,
                this.state.focusElement.value
            );
        }
    };

    componentDidMount() {
        this.sets();
    }

    handleChange(event: React.ChangeEvent<any>) {
        this.setState((state: PageState) => {
            let value: any = null;
            value = event.target.value;
            // @ts-ignore
            state.formData[event.target.name] = value;
            console.log(value)
            return state;
        })
    }

    onSubmit(event: FormEvent) {
        event.preventDefault();
        Services.Post.signIn({
            branch_custom_id: GlobalLocalStorages.User.get.branchId || this.state.formData.branchId,
            password: this.state.formData.password
        }).then(resData => {
            console.log("signin", resData);
            if (resData.status) {
                let user = resData.data.user;
                setGlobalAuthData({
                    user: {
                        branchId: user.branchId,
                        branchTitle: user.branchTitle,
                        branch_custom_id: user.branch_custom_id,
                        name: user.name,
                        lastname: user.lastname,
                        permissions: user.permissions,
                        role: user.role
                    }
                })
                GlobalLocalStorages.Token.set(resData.data.accessToken, resData.data.refreshToken);
                GlobalLocalStorages.User.set(getGlobalAuthData().user.branchId)
                this.props.router.navigate("/", {replace: true})
            }
        })
    }

    render() {
        return (
            <div className="flex items-center w-full h-full">
                <div
                    className="w-1/2 h-full bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80)",
                    }}
                >
                    <div className="h-full p-3 bg-black bg-opacity-50"></div>
                </div>
                <div className="flex items-center justify-center w-1/2">
                    <form onSubmit={e => this.onSubmit(e)} className="w-2/3">
                        <img src="https://manager.digigarson.org/static/logos/main-logo.png" className="mx-auto w-2/3"/>
                        <div className="mt-8 space-y-4">
                            <div>
                                <label htmlFor="branch" className="block text-sm font-medium text-white">
                                    {this.props.router.t("branch-code")}
                                </label>
                                <input
                                    type="text"
                                    name="branchId"
                                    id="branch"
                                    placeholder="100000"
                                    onChange={e => this.handleChange(e)}
                                    value={this.state.formData.branchId}
                                    className="mt-1 focus:ring-ebony focus:border-ebony block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-white">
                                    {this.props.router.t("password")}
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="******"
                                    onChange={e => this.handleChange(e)}
                                    value={this.state.formData.password}
                                    className="mt-1 focus:ring-ebony focus:border-ebony block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                />
                            </div>

                            <button
                                type="submit"
                                className="min-h-[46px] group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ebony focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ebony"
                            >
                                {this.props.router.t("submit")}
                            </button>
                        </div>
                        <button
                            onClick={() => window.require("electron").ipcRenderer.send("exit")}
                            type="button"
                            className="group relative w-1/2 flex justify-center mx-auto mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ebony focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ebony"
                        >
                            {this.props.router.t("desktop")}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default PageSignIn;
