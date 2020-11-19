import { Subscribed } from '../index';
declare type subscriber = (state: Subscribed) => void;
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
        callback: subscriber;
    }>;
    register(namespace: string, initState: any, reducer?: reducer): void;
    subscribe(namespace: string, publishers: string[], callback: subscriber): void;
    unSubscribe(namespace: string): void;
    dispatch(state: any, action: string): any;
    getState(namespace: string): any;
    reset(namespace: string): void;
}
declare const Model: Model;
export default Model;
