import { Component } from "react";
import { Routes, Route } from "react-router-dom";
import Auth from "./views/components/middleware/auth";
import Update from "./views/components/update";
import Layout from "./views/components/layout";

import Index from "./views/pages/index";
import Order from "./views/pages/orders";
import Customers from "./views/pages/customers";
import Takeaway from "./views/pages/take-away";
import SignIn from "./views/pages/sign-in";

import AllTakeaway from "./views/pages/all-takeaway";
import { PagePropCommonDocument } from "../modules/views/pages/pageProps";

type PageState = {};

type PageProps = {} & PagePropCommonDocument;

class AppRoutes extends Component<PageProps, PageState> {
  constructor(props: any) {
    super(props);
  }

  NotFound = () => {
    return (
      <div className="text-center">
        <h2 className="text-6xl font-bold">404</h2>
        <h3 className="text-xl font-medium">
          {this.props.router.t("page-not-found")}
        </h3>
        <button
          className="text-sm"
          onClick={() => this.props.router.navigate(-1)}
        >
          {this.props.router.t("turn-back")}
        </button>
      </div>
    );
  };

  render() {
    return (
      <Routes>
          <Route element={<Update {...this.props} />}>
              <Route element={<Layout {...this.props} />}>
                  <Route element={<Auth {...this.props} />}>
                      <Route
                          index
                          element={<Index {...this.props}/>}
                      />
                      <Route
                          path="/:type/:id"
                          element={<Index {...this.props}/>}
                      />

                      <Route
                          path="table/:id"
                          element={<Order {...this.props}/>}
                      />
                      <Route
                          path="takeaway"
                          element={<Takeaway {...this.props}/>}
                      />
                      <Route
                          path="takeaway/customers"
                          element={<Customers {...this.props}/>}
                      />
                      <Route
                          path="takeaway/order/:customerId"
                          element={<Order {...this.props}/>}
                      />
                      <Route
                          path="takeaway/all-takeaway"
                          element={<AllTakeaway {...this.props}/>}
                      />
                  </Route>

                  <Route
                      path="sign-in"
                      element={<SignIn {...this.props} />}
                  />

                  <Route path="*" element={<this.NotFound/>}/>
              </Route>
        </Route>
      </Routes>
    );
  }
}

export default AppRoutes;
