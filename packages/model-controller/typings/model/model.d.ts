import { Subscribed } from '../index';
declare type notifyCb = (state: Subscribed) => void;
export declare type reducer = (oldState: any, payload: any) => any;
interface Model {
    namespaces: string[];
    state: {
        [namespace: string]: any;
    };
    reducers: {
        namespace: string;
        reducer: reducer;
    }[];
    subs: Array<{
        publishers: string[];
        namespace: string;
        callback: notifyCb;
    }>;
    caches: Array<{
        namespace: string;
        callback: (state: any) => void;
    }>;
    register(namespace: string, initState: any, cacheCb: (state: any) => void, reducer?: reducer): void;
    subscribe(namespace: string, publishers: string[], callback: notifyCb): void;
    unSubscribe(namespace: string): void;
    dispatch(state: any, action: string): any;
    getState(namespace: string): any;
    reset(namespace: string): void;
}
declare const Model: Model;
export default Model;
