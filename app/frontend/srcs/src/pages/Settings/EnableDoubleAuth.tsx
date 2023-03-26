import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../../styles/Settings.css";
import { UserContext } from "../../contexts/UserProvider";
import { MenuContext } from "../../contexts/MenuProviders";

export default function EnableDoubleAuth() {
    const user = useContext(UserContext);
    const [userPref, setUserPref] = useState(user.doubleAuth);
    const menu = useContext(MenuContext);

    function editDoubleAuth() {
        axios
            .post("/api/profile/update/doubleAuth")
            .then(function () {
                const newValue = !userPref;
                setUserPref(newValue);
                user.editDoubleAuth(newValue);
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
            });
    }

    useEffect(() => {
        setUserPref(user.doubleAuth);
    }, [user.doubleAuth]);

    return (
        <div id="edit-double-auth">
            <label>
                Double Authentification
                <input
                    type="checkbox"
                    checked={userPref}
                    id="input-double-auth"
                    onChange={editDoubleAuth}
                />
            </label>
        </div>
    );
}
