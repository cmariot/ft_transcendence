import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../CSS/Validate.css";

const DoubleAuth = () => {
    const navigate = useNavigate();
    const [code2fa, setCode2fa] = useState("");

    const handleValidate2faChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        if (id === "double_auth_code") {
            setCode2fa(value);
        }
    };

    const submitValidate2faForm = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/second_auth", {
                code: code2fa,
            })
            .then(function (response) {
                navigate("/");
            })
            .catch(function (error) {
                console.log(error);
                alert("Your code is not valide.");
                setCode2fa("");
            });
    };

    //    const resendCode = async (event) => {
    //        event.preventDefault();
    //        await axios.get("/api/second_auth/resend").catch(function (error) {
    //            console.log(error);
    //        });
    //    };
    //
    //    const cancelRegister = async (event) => {
    //        event.preventDefault();
    //        await axios
    //            .get("/api/register/cancel")
    //            .then(function () {
    //                navigate("/login");
    //            })
    //            .catch(function (error) {
    //                console.log(error);
    //            });
    //    };

    return (
        <main id="validation-2fa-main">
            <aside id="validation-2fa-aside">
                <h2>Double Authentification</h2>
            </aside>

            <form id="validation-2fa-form">
                <h3>Enter the code you received by email</h3>
                <input
                    type="text"
                    id="double_auth_code"
                    placeholder="Check your emails"
                    onChange={handleValidate2faChange}
                />
                <div>
                    <input
                        type="submit"
                        className="button"
                        onClick={submitValidate2faForm}
                        value="Validate"
                    />
                </div>
            </form>
        </main>
    );
};
export default DoubleAuth;
