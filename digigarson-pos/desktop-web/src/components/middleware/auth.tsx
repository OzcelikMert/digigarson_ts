import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Authenticate from "services/authenticate"

export default function () {
    const Context = useContext(Authenticate.Context), from = useLocation();

    if (Context && !Context.IsAuthenticated)
        return <Navigate to="/sign-in" state={{ from }} replace />

    return <Outlet />;
}