import wretch from 'wretch'
import { promiseSettledResponse } from '../../types/apiTypes'

//function that promise
export function wretchWrapper(url: string): Promise<promiseSettledResponse> {
    return wretch(url)
        .get()
        .badRequest((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .notFound((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .unauthorized((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .internalError((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .res(response => response.json())
        .catch(error => {
            PubSub.publish('OPEN_ALERT', {
                type: 'error',
                msg: `Unexpected Error`
            })
        });
}

interface ErrorResponse {
    message: string;
    statusCode: number;
}


interface ErrorResponse {
    message: string;
    statusCode: number;
}

export function wretchAction(url: string, body: unknown): Promise<promiseSettledResponse> {
    return wretch(url)
        .post({ body })
        .badRequest((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .notFound((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .unauthorized((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .internalError((e) => {
            const error: ErrorResponse = {
                message: e.message,
                statusCode: e.status,
            };
            throw error;
        })
        .res(response => response.json())
        .catch(error => {
            PubSub.publish('OPEN_ALERT', {
                type: 'error',
                msg: `Unexpected Error`
            })
        });
}

export function promiseHandler(results: promiseSettledResponse[]):
    promiseSettledResponse[] {
    const errors = results.filter((result) => result.status === 'rejected')
    if (errors.length) {
        const reason = errors.map((e) => e.reason)
        throw new AggregateError(reason)
    } else {
        return results.map((result) => result.value)
    }
}
