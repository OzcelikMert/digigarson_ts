import Http from "services/http"
import Authenticate, { Service } from "services/authenticate"
import Branch from "services/branch"

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import English from "resources/en.json"
import Turkish from "resources/tr.json"

i18n.use(initReactI18next)
    .init({
        resources: {
            en: { translation: English },
            tr: { translation: Turkish }
        },
        lng: localStorage.getItem("language") || "tr",
        fallbackLng: "tr",
        interpolation: {
            escapeValue: false
        }
    });

export default function ({ children }: { children: JSX.Element }): JSX.Element {
    return (
        <Branch.Context.Provider value={Branch.createInstance()}>
            <Authenticate.Context.Provider value={Authenticate.createInstance(Service.getStoredTokens())}>
                <Authenticate.Context.Consumer>
                    {
                        value =>
                            <Http.Context.Provider value={Http.createInstance(value?.IsAuthenticated ? { Authorization: value.bearerToken() } : undefined)}>
                                {children}
                            </Http.Context.Provider>
                    }
                </Authenticate.Context.Consumer>
            </Authenticate.Context.Provider>
        </Branch.Context.Provider>
    )
}