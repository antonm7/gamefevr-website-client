import wretch from 'wretch'
import { PromiseHandlerProps } from '../../types/request'

//function that promise
export function wretchWrapper(url: string, request_name: string): Promise<object> {
    return wretch(url)
        .get()
        .badRequest(e => console.log('error on', request_name, e))
        .notFound(e => console.log('error on', request_name, e))
        .unauthorized(e => console.log('error on', request_name, e))
        .internalError(e => console.log('error on', request_name, e))
        .json(data => data)
}

export function wretchAction(url: string, body: unknown): Promise<string> {
    return wretch(url)
        .post({ body })
        .badRequest(() => { throw new Error() })
        .notFound(() => { throw new Error() })
        .unauthorized(() => { throw new Error() })
        .internalError(() => { throw new Error() })
        .res(response => response.json())
}

export function promiseHandler(results: PromiseHandlerProps[]): any[] {
    const errors = results.filter((result) => result.status === 'rejected')
    if (errors.length) {
        const reason = errors.map((e) => e.reason)
        throw new AggregateError(reason)
    } else {
        return results.map((result) => result.value)
    }
}
