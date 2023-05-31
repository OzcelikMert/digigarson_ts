import React from "react"
import Axios, { AxiosInstance, AxiosRequestHeaders } from "axios"

export class Service {
    private Context: AxiosInstance | null = null;

    constructor(context: AxiosInstance) {
        this.Context = context
    }

    public get instance(): AxiosInstance {
        return this.Context!;
    }

    public set instance(context: AxiosInstance) {
        this.Context = context;
    }

    public get baseURL(): string | undefined {
        return this.Context!.defaults.baseURL
    }

    public addHeader(key: string, value: string): string {
        return this.Context!.defaults.headers.common[key] = value
    }
}

export default class Http {
    static createInstance(defaultHeaders: AxiosRequestHeaders | undefined = undefined): Service {
        return new Service(Axios.create({
            baseURL: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_HOST}/v${process.env.REACT_APP_API_VERSION}/pos`,
            timeout: 30000,
            headers: defaultHeaders ? { ...defaultHeaders } : Object()
        }))
    }

    static Context: React.Context<Service | null> = React.createContext<Service | null>(null);
}