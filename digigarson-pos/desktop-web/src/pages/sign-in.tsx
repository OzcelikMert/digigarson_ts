import { useContext, useState, useEffect } from "react"
import { Navigate, useNavigate, useLocation } from "react-router-dom"

import { useFormik } from "formik";
import * as Yup from "yup";

import Http from "services/http"
import Authenticate from "services/authenticate"

import Spinner from "components/spinner"
import Alert from "components/alert"

import { useTranslation } from "react-i18next";

import Keyboard from "react-simple-keyboard";

export default function () {
    const AuthContext = useContext(Authenticate.Context);

    const location = useLocation(), from = (location.state as any)?.from?.pathname || "/"

    if (AuthContext && AuthContext.IsAuthenticated)
        return <Navigate to={"/"} replace />

    const HttpContext = useContext(Http.Context), navigate = useNavigate()
    const [error, setError] = useState(String());

    const [focusElement, setFocusElement] = useState<any>()
    const [keyboardOn, setKeyboardOn] = useState(false)
    const { t, i18n } = useTranslation();
    const hasSomeParentTheClass = (element: any, classname: any): boolean => {
        if (element.className?.split(' ').indexOf(classname) >= 0) return true;
        return element.parentNode && hasSomeParentTheClass(element.parentNode, classname);
    }

    useEffect(() => {
        window.addEventListener("click", (e: any) => {
            if (e.target.tagName === "INPUT") {
                setKeyboardOn(true)
            } else {
                if (hasSomeParentTheClass(e.target, "keyboard")) {
                    setKeyboardOn(true)
                } else {
                    setKeyboardOn(false)
                }
            }
        })

        window.addEventListener("focusin", (e: any) => {
            if (e.target.tagName === "INPUT") {
                setFocusElement(e.target)
                setKeyboardOn(true)
            } else {
                setKeyboardOn(false)
            }
        })
    })

    const formik = useFormik({
        initialValues: {
            branch_custom_id: window.localStorage.getItem("BranchID") || String(),
            password: String()
        },
        validationSchema: Yup.object().shape({
            branch_custom_id: Yup.string().min(6),
            password: Yup.string().min(6, t("min-password")).required(t("req-password")),
        }),
        onSubmit: (values, { setSubmitting }) => {
            setError(String());

            HttpContext?.instance.post("/signin", values)
                .then((response: any) => {
                    console.log(response)
                    AuthContext && AuthContext.Context?.setTokens({ access: response.data.accessToken, refresh: response.data.refreshToken });
                    AuthContext!.IsAuthenticated && navigate(from, { replace: true });

                    window.localStorage.setItem("BranchID", values.branch_custom_id);
                })
                .catch(error => setError(error.response.data));

            (setSubmitting(false), AuthContext!.IsAuthenticated) && navigate(from, { replace: true });
        }
    });

    const onChange = (input: any) => {
        if (document.activeElement) {
            const activeElement = document.activeElement as HTMLInputElement

            if (activeElement.tagName === "INPUT") {
                setFocusElement(document.activeElement)
                if (!(typeof activeElement.value === "string")) return
                if (focusElement === false) {
                    activeElement.value = input
                } else {
                    focusElement.value = input
                }
            } else {
                setKeyboardOn(true)
                focusElement.value = input
            }

            formik.setFieldValue(focusElement.name, focusElement.value);
        }
    }

    return <div className="flex items-center w-full h-full">
        <div className="w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80)" }}>
            <div className="h-full p-3 bg-black bg-opacity-50">
            </div>
        </div>
        {
            keyboardOn && <div onFocus={(e) => e.preventDefault()} className="keyboard">
                <Keyboard onChange={onChange} />
            </div>
        }
        <div className="flex items-center justify-center w-1/2">
            <form onSubmit={formik.handleSubmit} className="w-2/3">
                <img src="https://manager.digigarson.org/static/logos/main-logo.png" className="mx-auto w-2/3" />
                <div className="mt-8 space-y-4">
                    {
                        error ? <Alert props={{ className: "mb-4 text-xs" }} type="danger">
                            <span>{error}</span>
                        </Alert> : null
                    }
                    <div>
                        <label htmlFor="branch" className="block text-sm font-medium text-white">
                            {t("branch-code")}
                        </label>
                        <input
                            type="text"
                            name="branch_custom_id"
                            id="branch"
                            placeholder="100000"
                            onChange={formik.handleChange}
                            value={formik.values.branch_custom_id}
                            className="mt-1 focus:ring-ebony focus:border-ebony block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-white">
                            {t("password")}
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="******"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="mt-1 focus:ring-ebony focus:border-ebony block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                    <button
                        type="submit"
                        className="min-h-[46px] group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ebony focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ebony"
                    >
                        {
                            formik.isSubmitting ? <Spinner className="text-white w-5 h-5" strokeWidth={4} /> : <span>{t("sign-in")}</span>
                        }
                    </button>
                </div>
                <button
                    onClick={() => window.require("electron").ipcRenderer.send("exit")}
                    type="button"
                    className="group relative w-1/2 flex justify-center mx-auto mt-2 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-ebony focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ebony"
                >
                    {t("desktop")}
                </button>
            </form>
        </div>
    </div>
}