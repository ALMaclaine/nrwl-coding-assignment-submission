import styles from './loader.module.css';
import React, {Suspense, PropsWithChildren} from "react";
import {ErrorBoundary} from "react-error-boundary";

export interface LoaderProps {
    fallback: never,
    onReset: (...args: unknown[]) => void,
}

export function Loader(props: PropsWithChildren<LoaderProps>) {
    const {children, fallback, onReset} = props;
    return (
        <ErrorBoundary FallbackComponent={fallback} onReset={onReset}>
            <Suspense fallback={<div className={styles['loader']}>Loading...</div>}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}

export default Loader;
