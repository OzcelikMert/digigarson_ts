import { PagePropCommonDocument } from "modules/views/pages/pageProps";
import { Component } from "react";
import { Outlet } from "react-router-dom";

type PageProps = {} & PagePropCommonDocument;

type PageState = {};

class Layout extends Component<PageProps, PageState> {
  constructor(props: any) {
    super(props);
  }
  render() {
    return <Outlet />;
  }
}

export default Layout;
