import axios from "axios";
import { useEffect, useState } from "react";
import "../CSS/Settings.css";

export default function EnableDoubleAuth(props) {
    const [userPref, setUserPref] = useState(props.userProps.doubleAuth);

    function editDoubleAuth(event) {
        axios
            .post("/api/profile/update/doubleAuth")
            .then(function () {
                const newValue: boolean = !props.userProps.doubleAuth;
                setUserPref(newValue);
                props.userProps.setDoubleAuth(newValue);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        setUserPref(props.userProps.doubleAuth);
    }, [props.userProps.doubleAuth]);

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
