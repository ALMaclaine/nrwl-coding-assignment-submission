import styles from './app-route.module.css';
import {useState} from "react";
import {Outlet} from "react-router-dom";

export function AppRoute() {
    const [header, setHeader] = useState('Ticketing App');
    return <>
        <div className={styles['header']}>{header}</div>
        <div className={styles['app']}>
            <Outlet context={setHeader}/>
        </div>
    </>;
}

export default AppRoute;
