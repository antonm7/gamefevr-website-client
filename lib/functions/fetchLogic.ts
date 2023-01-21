import wretch, { WretchResponseChain } from 'wretch'
import { DetailedGame } from '../../types'

export function wretchWrapper(url: string, request_name: string): any {
    return wretch(url)
        .get()
        .badRequest(e => console.log('error on', request_name, e))
        .notFound(e => console.log('error on', request_name, e))
        .unauthorized(e => console.log('error on', request_name, e))
        .internalError(e => console.log('error on', request_name, e))
        .json(data => data)
}

export function promiseHandler(results: any[]): any {
    const errors: { status: "rejected", reason: any }[]
        = results.filter((result) => result.status === 'rejected')
    if (errors.length) {
        const reason: string[] = errors.map((e) => e.reason)
        throw new AggregateError(reason)
    }
    return results.map((result: PromiseFulfilledResult<any>) => result.value)
}