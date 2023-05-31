import {NavigateFunction, Params, URLSearchParamsInit} from "react-router-dom";
import {UseTranslationResponse} from "react-i18next";
import {i18n, TFunction} from "i18next";
import Providers from "../../../app/providers";
import LangParamDocument from "../../resources";
import {AppGlobalGetState, AppGlobalSetState} from "../index";

interface PagePropCommonDocument {
    router: PagePropRouterDocument
    setGlobalData: (data: AppGlobalSetState["globalData"], callBack?: () => void) => void
    getGlobalData: AppGlobalGetState["globalData"]
    openModal: (type: any, data?: any) => void
    closeModal: () => void
    toggleState: () => void
}

type LocationDocument = {
    state?: any
} & Location

interface PagePropRouterDocument {
    location: LocationDocument,
    navigate: NavigateFunction,
    params: Readonly<Params<string>>,
    searchParams: readonly [URLSearchParams, ((nextInit: URLSearchParamsInit, navigateOptions?: ({ replace?: boolean | undefined, state?: any } | undefined)) => void)],
    t: (key: LangParamDocument) => string
    i18n: i18n
}

export {
    PagePropCommonDocument
}