import axios from "axios";
import { useEffect, useState } from "react";
import "../CSS/Settings.css";

export default function EnableDoubleAuth(props) {
    const [userPref, setUserPref] = useState(props.user["doubleAuth"]);

    function editDoubleAuth(event) {
        axios
            .post("/api/profile/update/doubleAuth")
            .then(function () {
                const newValue: boolean = !props.user["doubleAuth"];
                setUserPref(newValue);
                props.user["setDoubleAuth"](newValue);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    useEffect(() => {
        setUserPref(props.user["doubleAuth"]);
    }, [props.user["doubleAuth"]]);

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
