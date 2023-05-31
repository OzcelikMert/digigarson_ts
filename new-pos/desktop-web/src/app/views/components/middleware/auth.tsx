import {PagePropCommonDocument} from "modules/views/pages/pageProps";
import {Component, ReactNode} from "react";
import {Navigate, Outlet} from "react-router-dom";

type PageState = {};

type PageProps = {} & PagePropCommonDocument;

class Auth extends Component<PageProps, PageState> {
    constructor(props: any) {
        super(props);
    }

    //gerek kaldı mı?
    //Context = useContext(Authenticate.Context);
    from = this.props.router.location;

    render(): ReactNode {
        // if (this.Context && !this.Context.IsAuthenticated) {
        //   return <Navigate to="/sign-in" state={this.from} replace />;
        // }

        return <Outlet/>;
    }
}

export default Auth;
