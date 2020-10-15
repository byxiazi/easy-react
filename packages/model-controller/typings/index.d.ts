import React from 'react';
import { RouteComponentProps } from 'react-router';
import { reducer } from './model/model';
export interface CacheOpts {
    cache: 'sessionStorage' | 'localStorage';
    expired?: number;
}
export interface ModelConfig {
    namespace: string;
    publishers?: string[];
    initState?: any;
    reducer?: reducer;
    cacheOpts?: CacheOpts;
    clearCache?: boolean;
    reset?: boolean;
}
export interface WrapComponentProps {
    [key: string]: any;
    dispatch: (state: any) => void;
    getState: () => any;
    context: RouteComponentProps;
}
export interface ControllerProps {
    [key: string]: any;
}
interface ControllerState {
    [key: string]: any;
}
export default function config({ namespace, publishers, initState, reducer, cacheOpts, clearCache, reset, }: ModelConfig): (WrapComponent: React.ComponentClass<WrapComponentProps, any> | React.FunctionComponent<WrapComponentProps>) => {
    new (props: ControllerProps): {
        componentDidMount(): void;
        init: () => void;
        clearAbandonCache: () => void;
        getInitState: (ns: string) => any;
        register: (ns: string, state: any) => void;
        update: (state: any) => void;
        getState: () => any;
        dispatch: (state: any, action?: string | undefined) => void;
        componentWillUnmount(): void;
        render(): JSX.Element;
        context: any;
        setState<K extends string | number>(state: ControllerState | ((prevState: Readonly<ControllerState>, props: Readonly<ControllerProps>) => ControllerState | Pick<ControllerState, K> | null) | Pick<ControllerState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callback?: (() => void) | undefined): void;
        readonly props: Readonly<ControllerProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        state: Readonly<ControllerState>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    contextType?: React.Context<any> | undefined;
};
export {};
