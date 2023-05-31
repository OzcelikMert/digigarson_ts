import $ from "jquery";
import {ErrorCodes, Timeouts} from "../../public/ajax";
import {ApiRequestParamDocument} from "../../modules/services/api";
import ApiRequestConfig from "./config";
import ServiceResultDocument from "../../modules/services/api/result";
import {getGlobalAuthData} from "../../config/global";

class ApiRequest {
    constructor(params: ApiRequestParamDocument) {
        this.params = params;
        this.result = {
            data: [],
            customData: null,
            status: true,
            message: "",
            errorCode: ErrorCodes.success,
            statusCode: 200,
            source: ""
        };
    }

    private params: ApiRequestParamDocument;
    private result: ServiceResultDocument<any>;

    private getApiUrl(): string {
        let apiUrl = ApiRequestConfig.mainUrl;
        this.params.url.forEach(url => {
            if (url) {
                apiUrl += url + "/";
            }
        })
        return apiUrl.removeLastChar();
    }

    private request(resolve?: (value: any) => void) {
        let self = this;
        let isRequestFailed = false;
        $.ajax({
            url: this.getApiUrl(),
            data: this.params.data,
            method: this.params.method,
            async: this.params.async,
            contentType: this.params.contentType,
            processData: this.params.processData,
            timeout: Timeouts.verySlow,
            headers: {
                'Authorization': `Bearer ${getGlobalAuthData().tokens.access}`,
                "x-refresh": `${getGlobalAuthData().tokens.refresh}`
            },
            beforeSend: function () {
            },
            complete: function () {
                if (resolve) resolve(self.result)
            },
            success: (resData) => {
                this.result.data = resData;
            },
            error: (xhr, ets) => {
                this.result.status = false;
                this.result.errorCode = ErrorCodes.notFound;
                this.result.message = ets;
                this.result.customData = xhr;
                isRequestFailed = true;
            }
        });
    }

    init(): Promise<ServiceResultDocument<any>> {
        return new Promise(resolve => {
            this.request(resolve);
        })
    }

    initSync(): ServiceResultDocument<any> {
        this.request();
        return this.result;
    }
}

export default ApiRequest;