import { Subscribed } from '../index';
declare type notifyCb = (state: Subscribed) => void;
declare type setCache = (state: any, expired?: number) => void;
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
        callback: setCache;
    }>;
    register(namespace: string, initState: any, setCacheCb: setCache, reducer?: reducer): void;
    subscribe(namespace: string, publishers: string[], callback: notifyCb): void;
    unSubscribe(namespace: string): void;
    unRegister(namespace: string): void;
    dispatch(state: any, action: string, expired?: number): any;
    getState(namespace: string): any;
    reset(namespace: string): void;
}
declare const Model: Model;
export default Model;
