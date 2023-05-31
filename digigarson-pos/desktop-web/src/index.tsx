import React, {Component} from "react";
import ReactDOM from "react-dom";

import Providers from "providers"
import Routes from "routes"

import "./styles/index.css"
import "./index.css"
import './styles/App.css'
import './styles/takeaway.css'

ReactDOM.render(
  <React.StrictMode>
    {
      Boolean(window.require) ?
        <Providers>
          <Routes />
        </Providers> : <div className="text-center">dunno, where are you?</div>
    }
  </React.StrictMode>,
  document.getElementById("root")
);