import axios from "axios";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../CSS/Validate.css";

const Validate = () => {
    const navigate = useNavigate();
    const [code, setCode] = useState("");

    const handleValidateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        if (id === "code") {
            setCode(value);
        }
    };

    const submitValidateForm = async (event) => {
        event.preventDefault();
        await axios
            .post("/api/register/validate", {
                code: code,
            })
            .then(function (response) {
                navigate("/");
            })
            .catch(function (error) {
                alert("Your code is not valide.");
                setCode("");
            });
    };

    const resendCode = async (event) => {
        event.preventDefault();
        await axios.get("/api/register/resend").catch(function (error) {
            console.log(error);
        });
    };

    const cancelRegister = async (event) => {
        event.preventDefault();
        await axios
            .get("/api/register/cancel")
            .then(function () {
                navigate("/login");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <main id="validation-main">
            <aside id="validation-aside">
                <h2>Validate your email</h2>
                <p>Check your emails, we just send you a verification code.</p>
                <button onClick={resendCode}>Resend code</button>
            </aside>

            <form id="validation-form">
                <h3>Enter the code you received by email</h3>
                <input
                    type="text"
                    id="code"
                    placeholder="Check your emails"
                    onChange={handleValidateChange}
                />
                <div id="form-validation-choices">
                    <input
                        type="submit"
                        className="button"
                        onClick={submitValidateForm}
                        value="Validate"
                    />
                    <Link onClick={cancelRegister} to="">
                        cancel
                    </Link>
                </div>
            </form>
        </main>
    );
};
export default Validate;
