import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/Validate.css";
import { MenuContext } from "../../contexts/menu/MenuContext";

const Validate = () => {
    const navigate = useNavigate();
    const menu = useContext(MenuContext);
    const [code, setCode] = useState("");

    const handleValidateChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        if (id === "code") {
            setCode(value);
        }
    };

    const submitValidateForm = async (event: any) => {
        event.preventDefault();
        await axios
            .post("/api/register/validate", {
                code: code,
            })
            .then(function () {
                navigate("/");
            })
            .catch(function () {
                menu.displayError("Your code is not valide.");
                setCode("");
            });
    };

    const resendCode = async (event: any) => {
        event.preventDefault();
        await axios.get("/api/register/resend").catch(function (error) {
            menu.displayError(error.response.data.message);
        });
    };

    const cancelRegister = async (event: any) => {
        event.preventDefault();
        await axios
            .get("/api/register/cancel")
            .then(function () {
                navigate("/");
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
            });
    };

    return (
        <div className="flex">
            <section id="validation-section">
                <aside id="validation-aside">
                    <h2>Validate your email</h2>
                    <p>
                        Check your emails, we just send you a verification code.
                    </p>
                    <button onClick={resendCode}>Resend code</button>
                </aside>

                <form id="validation-form" autoComplete="off">
                    <h3>Enter the code you received by email</h3>
                    <input
                        type="text"
                        id="code"
                        placeholder="your code"
                        onChange={handleValidateChange}
                        autoFocus
                        required
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
            </section>
        </div>
    );
};
export default Validate;
