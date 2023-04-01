import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../../styles/Settings.css";
import { UserContext } from "../../contexts/user/UserContext";
import { MenuContext } from "../../contexts/menu/MenuContext";

export default function EnableDoubleAuth() {
    const user = useContext(UserContext);
    const menu = useContext(MenuContext);
    const [userPref, setUserPref] = useState(user.doubleAuth);

    useEffect(() => {
        setUserPref(user.doubleAuth);
    }, [user.doubleAuth]);

    function editDoubleAuth() {
        axios
            .post("/api/profile/update/doubleAuth")
            .then(function () {
                const newValue = !userPref;
                setUserPref((prevState) => !prevState);
                user.editDoubleAuth(newValue);
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
            });
    }

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
