import { NamedGame } from "."

interface ExtendedPromise {
    status: 'rejected' | 'fulfilled'
    reason: string
    value: any
}

export interface queryNameType extends ExtendedPromise {
    games: NamedGame[]
}

export interface promiseSettledResponse extends ExtendedPromise {
    [property: string]: string | boolean | null | any
}