import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../CSS/DoubleAuth.css";

const DoubleAuth = () => {
    const navigate = useNavigate();
    const [code2fa, setCode2fa] = useState("");

    const handleValidate2faChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        if (id === "double_auth_code") {
            setCode2fa(value);
        }
    };

    const submitValidate2faForm = async (event: any) => {
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

    const resend2faCode = async (event: any) => {
        event.preventDefault();
        await axios.get("/api/second_auth/resend").catch(function (error) {
            console.log(error);
        });
    };

    const cancel2fa = async (event: any) => {
        event.preventDefault();
        await axios
            .get("/api/second_auth/cancel")
            .then(function () {
                navigate("/login");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <section id="validation-2fa-section">
            <aside id="validation-2fa-aside">
                <h2>Double Authentification</h2>
                <p>Check your emails, we just send you a verification code.</p>
                <button onClick={resend2faCode}>Resend code</button>
            </aside>

            <form id="validation-2fa-form" autoComplete="off">
                <h3>Enter the code you received by email</h3>
                <input
                    type="text"
                    id="double_auth_code"
                    placeholder="Check your emails"
                    onChange={handleValidate2faChange}
                    autoFocus
                    autoComplete="off"
                    required
                />
                <div id="form-2fa-choices">
                    <input
                        type="submit"
                        className="button"
                        onClick={submitValidate2faForm}
                        value="Validate"
                    />
                    <Link onClick={cancel2fa} to="">
                        cancel
                    </Link>
                </div>
            </form>
        </section>
    );
};
export default DoubleAuth;
