import React, { ClassAttributes } from 'react';
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
    reset?: boolean;
}
export declare type Subscribed = {
    [key: string]: any;
};
export interface WrappedComponentProps extends ClassAttributes<any> {
    dispatch: (state: any, action?: string) => void;
    getState: () => any;
    subscribed: Subscribed;
    context: RouteComponentProps;
}
export interface ControllerProps {
    [key: string]: any;
}
interface ControllerState {
    [key: string]: any;
}
export declare const getState: (ns: string) => any;
export default function config({ namespace, publishers, initState, reducer, cacheOpts, reset, }: ModelConfig): (WrappedComponent: React.ComponentType<WrappedComponentProps>) => {
    new (props: ControllerProps): {
        componentDidMount(): void;
        init: () => void;
        clearAbandonCache: () => void;
        getInitState: (ns: string) => any;
        register: (ns: string, state: any) => void;
        update: (state: Subscribed) => void;
        getState: (ns?: string | undefined) => any;
        dispatch: (state: any, action?: string | undefined) => void;
        setCache: (state: any) => void;
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
        shouldComponentUpdate?(nextProps: Readonly<ControllerProps>, nextState: Readonly<ControllerState>, nextContext: any): boolean;
        componentDidCatch?(error: Error, errorInfo: React.ErrorInfo): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<ControllerProps>, prevState: Readonly<ControllerState>): any;
        componentDidUpdate?(prevProps: Readonly<ControllerProps>, prevState: Readonly<ControllerState>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<ControllerProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<ControllerProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<ControllerProps>, nextState: Readonly<ControllerState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<ControllerProps>, nextState: Readonly<ControllerState>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export {};
