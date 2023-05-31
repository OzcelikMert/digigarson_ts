import ReactDOM from "react-dom";
import App from "./app/";

import "./library/variable/array"
import "./library/variable/string"
import "./library/variable/number"
import "./library/variable/date"
import "./library/variable/math"
import {BrowserRouter} from "react-router-dom";

import "app/views/pages/orders/products/products.css"

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById("root")
);