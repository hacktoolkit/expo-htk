import React from 'react';

type ContextAction<T> = { type: 'UPDATE'; payload: Partial<T> } | { type: 'RESET' };
type IProvider<T> = React.FC<{ value?: Partial<T>; children: React.ReactNode }>;
type IuseContext<T> = () => T;
type IuseContextDispatch<T> = () => React.Dispatch<ContextAction<T>>;
type IuseUpdate<T> = () => (payload: Partial<T>) => void;

export function contextBuilder<T>(
    defaultValue: T
): [IProvider<T>, IuseContext<T>, IuseContextDispatch<T>, IuseUpdate<T>] {
    const Context = React.createContext<T>(defaultValue);
    const DispatchContext = React.createContext<React.Dispatch<ContextAction<T>>>(
        () => {}
    );

    const reducer: React.Reducer<T, ContextAction<T>> = (state, action) => {
        switch (action.type) {
            case 'UPDATE':
                return { ...state, ...action.payload };
            case 'RESET':
                return defaultValue;
        }
    };

    const useContext = () => {
        const context = React.useContext(Context);
        if (context === undefined) {
            throw new Error('useContext must be used within a Provider');
        }
        return context;
    };

    const useDispatch = () => {
        const dispatch = React.useContext(DispatchContext);
        if (dispatch === undefined) {
            throw new Error('useDispatch must be used within a Provider');
        }
        return dispatch;
    };

    const useUpdate = () => {
        const dispatch = useDispatch();

        return (payload: Partial<T>) => dispatch({ type: 'UPDATE', payload });
    };

    const Provider = ({
        value = {},
        children,
    }: {
        value?: Partial<T>;
        children: React.ReactNode;
    }) => {
        const [state, dispatch] = React.useReducer(reducer, defaultValue);

        const context = React.useMemo(() => ({ ...state, ...value }), [state, value]);

        return React.createElement(DispatchContext.Provider, { value: dispatch }, [
            React.createElement(Context.Provider, { value: context }, children),
        ]);
    };

    return [Provider, useContext, useDispatch, useUpdate];
}
