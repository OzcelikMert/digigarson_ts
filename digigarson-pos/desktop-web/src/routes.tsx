import { useContext, useEffect } from "react"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Auth from "components/middleware/auth"
import Update from "components/update"
import Layout from "components/layout"

import Index from "pages/index"
import Order from "pages/orders/index"
import Customers from "pages/customers"
import Takeaway from "pages/take-away";
import Neworder from "pages/takeaway-new-order"
import SignIn from "pages/sign-in"

import Http from "services/http"
import Authenticate, { Service } from "services/authenticate"
import Branch from "services/branch"
import Printer from "services/printer"
import TakeawayDetail from "pages/takeaway-detail";
import AllTakeaway from "pages/all-takeaway"

export default function () {
    const { t, i18n } = useTranslation();
    const AuthContext = useContext(Authenticate.Context);
    const HttpContext = useContext(Http.Context);
    const BranchContext = useContext(Branch.Context);

    useEffect(() => {
        AuthContext?.Context?.tokens.access && AuthContext?.Context?.tokens.refresh ? AuthContext.storeTokens() : Service.removeStoredTokens()

        AuthContext && (AuthContext.User = Service.parseUserFromToken(AuthContext?.Context?.tokens.access))
        AuthContext && AuthContext.User && (AuthContext.IsAuthenticated = AuthContext.verifyExpireTime())

        AuthContext && AuthContext.IsAuthenticated && HttpContext?.addHeader("Authorization", AuthContext.bearerToken());

        AuthContext?.IsAuthenticated && !BranchContext?.[0] && HttpContext?.instance.get("/mybranch").then(response => response && BranchContext?.[1](response.data))

        if (!window.localStorage.getItem("rightButtons")) {
            AuthContext?.storeUserConfig()
        }

        Printer.loadSettings();
        //Printer.IsPreview = true
    }, [AuthContext?.Context?.tokens])

    const NotFound = () => {
        const navigate = useNavigate()

        return <div className="text-center">
            <h2 className="text-6xl font-bold">404</h2>
            <h3 className="text-xl font-medium">{t("page-not-found")}</h3>
            <button className="text-sm" onClick={() => navigate(-1)}>{t("turn-back")}</button>
        </div>
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Update />}>
                    <Route element={<Layout />}>
                        <Route element={<Auth />}>
                            <Route index element={<Index />} />

                            <Route path="/:type/:id" element={<Index />} />
                            <Route path="table/:id" element={<Order />} />
                            <Route path="takeaway" element={<Takeaway />} />
                            <Route path="takeaway/detail/:id" element={<TakeawayDetail />} />
                            <Route path="takeaway/customers" element={<Customers />} />
                            <Route path="takeaway/order/:customerId" element={<Order />} />   
                            <Route path="takeaway/all-takeaway" element={<AllTakeaway />}></Route>                         
                        </Route>

                        <Route path="sign-in" element={<SignIn />} />

                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter >
    )
}