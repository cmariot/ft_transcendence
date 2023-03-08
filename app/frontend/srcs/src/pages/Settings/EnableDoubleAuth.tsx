import axios from "axios";
import { useContext, useEffect, useState } from "react";
import "../../styles/Settings.css";
import { UserContext } from "../../Contexts/UserProvider";

export default function EnableDoubleAuth() {
    const user = useContext(UserContext);
    const [userPref, setUserPref] = useState(user.doubleAuth);

    function editDoubleAuth() {
        axios
            .post("/api/profile/update/doubleAuth")
            .then(function () {
                const newValue = !userPref;
                setUserPref(newValue);
                user.editDoubleAuth(newValue);
            })
            .catch(function (error) {
                console.log(error);
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
