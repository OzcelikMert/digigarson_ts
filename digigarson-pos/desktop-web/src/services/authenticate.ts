import { buttons, rightButtons, bottomButtons, takeawayButtons, caseSaleButtons } from 'constants/checkButtons';
import React from "react"

import IUser from "services/interfaces/user"

import { JsonWebToken } from "utilities/jwt"

export interface IToken {
    access: string;
    refresh: string;
}

export type State = {
    tokens: IToken,
    setTokens: React.Dispatch<React.SetStateAction<IToken>>
};

export class Service {
    public readonly Context: State | null = null;
    public User: IUser | null = null;
    public IsAuthenticated: boolean = false;

    constructor(context: State) {
        this.Context = context;

        this.User = Service.parseUserFromToken(this.Context?.tokens.access)
        this.IsAuthenticated = this.verifyExpireTime()
    }

    public signOut(): void {
        this.IsAuthenticated && (Service.removeStoredTokens(), this.Context?.setTokens({ access: String(), refresh: String() }));
    }

    public storeUserConfig(): void {
        window.localStorage.setItem("allButtons", JSON.stringify(buttons));
        window.localStorage.setItem("rightButtons", JSON.stringify(rightButtons));
        window.localStorage.setItem("bottomButtons", JSON.stringify(bottomButtons));
        window.localStorage.setItem("takeawayButtons", JSON.stringify(takeawayButtons));
        window.localStorage.setItem("caseSaleButtons", JSON.stringify(caseSaleButtons))
        window.localStorage.setItem("priceChangedOrders", "clear");
    }

    public storeTokens(): void {
        window.localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN_NAME!, this.Context!.tokens.access);
        window.localStorage.setItem(process.env.REACT_APP_REFRESH_TOKEN_NAME!, this.Context!.tokens.refresh);
    }

    public static removeStoredTokens(): void {
        window.localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN_NAME!);
        window.localStorage.removeItem(process.env.REACT_APP_REFRESH_TOKEN_NAME!);
    }

    public static getStoredTokens(): IToken {
        return {
            access: window.localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_NAME!)!,
            refresh: window.localStorage.getItem(process.env.REACT_APP_REFRESH_TOKEN_NAME!)!
        }
    }

    public checkUser() {
        if (this.User)
            this.IsAuthenticated = this.verifyExpireTime()
    }

    public static parseUserFromToken(token: string | undefined): IUser | null {
        if (!token)
            return null

        try {
            const parse: IUser = JsonWebToken.parse<IUser>(token);

            return {
                ...parse,
                createdAt: new Date(parse.createdAt),
                updatedAt: new Date(parse.updatedAt),
                exp: new Date(<unknown>parse.exp as number * 1000),
                iat: new Date(<unknown>parse.iat as number * 1000)
            }
        } catch {
            return null
        }
    }

    public verifyExpireTime(): boolean {
        return JsonWebToken.verifyExpireTime(this.User?.exp || null)
    }

    public bearerToken(): string {
        return `Bearer ${this.Context?.tokens.access}`
    }
}

export default class Authenticate {
    public static createInstance(initialValue: IToken | undefined = undefined): Service {
        const [tokens, setTokens] = React.useState<IToken>({ access: initialValue?.access || String(), refresh: initialValue?.refresh || String() })
        return new Service({ tokens, setTokens })
    }

    public static Context: React.Context<Service | null> = React.createContext<Service | null>(null);
}