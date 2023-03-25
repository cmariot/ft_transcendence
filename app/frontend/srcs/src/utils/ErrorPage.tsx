import { useContext } from "react";
import { MenuContext } from "../contexts/MenuProviders";
import "../styles/ErrorPage.css";

export default function ErrorPage() {
    const menu = useContext(MenuContext);

    return (
        <div id="error-page">
            <p>
                <b>Error : {menu.errorMessage}</b>
            </p>
            <button onClick={() => menu.closeError()}>close</button>
        </div>
    );
}
