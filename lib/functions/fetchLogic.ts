import wretch from 'wretch'

export function wretchWrapper(url: string, request_name: string): Promise<unknown> {
    return wretch(url)
        .get()
        .badRequest(e => console.log('error on', request_name, e))
        .notFound(e => console.log('error on', request_name, e))
        .unauthorized(e => console.log('error on', request_name, e))
        .internalError(e => console.log('error on', request_name, e))
        .json(data => data)
}

export function wretchAction(url: string, body: unknown): Promise<unknown> {
    return wretch(url)
        .post({ body })
        .badRequest(e => { throw new Error() })
        .notFound(e => { throw new Error() })
        .unauthorized(e => { throw new Error() })
        .internalError(e => { throw new Error() })
        .res(response => response.json())
}

export function promiseHandler(results: any[]): any {
    const errors: { status: "rejected", reason: any }[]
        = results.filter((result) => result.status === 'rejected')
    if (errors.length) {
        const reason: string[] = errors.map((e) => e.reason)
        throw new AggregateError(reason)
    }
    console.log(results)
    return results.map((result: PromiseFulfilledResult<unknown>) => result.value)
}
