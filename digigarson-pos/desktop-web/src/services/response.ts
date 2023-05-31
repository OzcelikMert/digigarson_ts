import { useState } from "react"
import { AxiosResponse, AxiosResponseHeaders, AxiosError } from "axios"

export default class Response<T = any> {
    private Data: [T | null, React.Dispatch<React.SetStateAction<T | null>>];
    private Headers = useState<AxiosResponseHeaders | null>(null);
    private Error = useState<AxiosError | null>(null);
    private Loading = useState<boolean>(false);

    /**
     * 
     * @param data This parameter is temp for fake data
     */
    constructor(data?: T | null) {
        this.Data = useState<T | null>(data || null)
    }

    public get data(): T {
        return this.Data[0]!
    }

    public set data(value: T) {
        this.Data[1](value)
    }

    public get headers(): AxiosResponseHeaders | null {
        return this.Headers[0]
    }

    public get error(): AxiosError | null {
        return this.Error[0]
    }

    public get loading(): boolean {
        return this.Loading[0]
    }

    public handle(response: Promise<AxiosResponse<T, any> | undefined>, delay: number = 0) {
        setTimeout((this.reset(), () => response.then((response: AxiosResponse<T, any> | undefined) => {
            if (!response)
                return

            this.Headers[1](response.headers)
            this.Data[1](response.data)
            this.Loading[1](false)
        }).catch((error: AxiosError) => {
            if (!error)
                return

            this.Headers[1](error.response?.headers!)
            this.Error[1](error)
            this.Loading[1](false)
        })), delay);
    }

    public reset() {
        this.Data[1](null)
        this.Headers[1](null)
        this.Error[1](null)
        this.Loading[1](true)
    }
}