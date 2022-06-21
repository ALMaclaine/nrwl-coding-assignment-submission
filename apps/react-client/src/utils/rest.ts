import {RANDOM_ERROR} from "../config";

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
    Accept: 'application/json, text/plain, */*',
};

const HTTP_METHODS = {
    GET: 'GET',
    DELETE: 'DELETE',
    POST: 'POST',
    PUT: 'PUT',
};

const createAborter = () => {
    const aborter = new AbortController();
    const {signal} = aborter;
    const abort = () => aborter.abort();
    return {signal, abort};
};

type Aborter = () => void;

const createOptions = (headers: object) => {
    const {signal, abort} = createAborter();

    const finalHeaders = {
        ...DEFAULT_HEADERS,
        ...headers,
    };

    const options = {
        headers: finalHeaders,
        signal,
    };
    return {abort, options};
};

type FetchOptions = {
    url: string,
    body?: object,
    headers?: object,
    method: string,
};

const request = (fetchOptions: FetchOptions) => {
    const {headers, url, body, method} = fetchOptions;
    const {abort, options} = createOptions(headers || {});
    const req = fetch(url, {
        ...options,
        method,
        body: JSON.stringify(body),
    })
    return {req, abort};
};

const timeoutRequest = (fetchOptions: FetchOptions, timeout: number = Number.MAX_SAFE_INTEGER) => {
    const {req, abort} = request(fetchOptions);
    const timeoutRef = setTimeout(abort, timeout);
    req.then(() => clearTimeout(timeoutRef));
    return {req, abort};
};

interface CustomError extends Error {
    info?: object,
    status?: number,
}

const fetcher = async (prom: Promise<any>) => {
    const res = await prom;
    // If the status code is not in the range 200-299,
    // we still try to parse and throw it.
    if (!res.ok) {
        const error: CustomError = new Error('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        error.info = await res.json()
        error.status = res.status
        throw error
    }

    if(RANDOM_ERROR && Math.random() > .5) {
        throw new Error('random rest error');
    }

    return res.json()
};
export {timeoutRequest, FetchOptions, Aborter, HTTP_METHODS, CustomError, fetcher};
