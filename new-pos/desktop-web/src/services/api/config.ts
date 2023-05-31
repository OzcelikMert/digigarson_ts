import {ApiRequestConfigDocument} from "../../modules/services/api/config";

let ApiRequestConfig: ApiRequestConfigDocument = {
    mainUrl: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/v${process.env.REACT_APP_API_VERSION}/pos/`
}

export default ApiRequestConfig;