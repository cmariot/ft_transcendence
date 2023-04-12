import { useContext } from "react";
import "../styles/ErrorPage.css";
import { MenuContext } from "../contexts/menu/MenuContext";

export default function ErrorPage() {
    const menu = useContext(MenuContext);

    return (
        <div id="error-page">
            <p>
                <b>Error : {menu.errorMessage}</b>
            </p>
            <button onClick={() => menu.closeError()} autoFocus>
                close
            </button>
        </div>
    );
}
