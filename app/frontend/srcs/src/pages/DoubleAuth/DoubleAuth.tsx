import axios from "axios";
import { ChangeEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/DoubleAuth.css";
import { MenuContext } from "../../contexts/menu/MenuContext";

const DoubleAuth = () => {
    const navigate = useNavigate();
    const [code2fa, setCode2fa] = useState("");
    const menu = useContext(MenuContext);

    const handleValidate2faChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target;
        if (id === "double_auth_code") {
            setCode2fa(value);
        }
    };

    async function submitValidate2faForm(event: any) {
        event.preventDefault();
        await axios
            .post("/api/secondauth", {
                code: code2fa,
            })
            .then(function (response) {
                navigate("/");
            })
            .catch(function (error) {
                menu.displayError("Your code is not valide.");
                setCode2fa("");
            });
    }

    const resend2faCode = () => {
        axios.get("/api/second_auth/resend").catch(function (error) {
            menu.displayError(error.response.data.message);
        });
    };

    const cancel2fa = () => {
        axios
            .get("/api/second_auth/cancel")
            .then(function () {
                navigate("/");
            })
            .catch(function (error) {
                menu.displayError(error.response.data.message);
            });
    };

    return (
        <div className="flex">
            <section id="validation-2fa-section">
                <aside id="validation-2fa-aside">
                    <h2>Double Authentification</h2>
                    <p>
                        Check your emails, we just send you a verification code.
                    </p>
                    <button onClick={() => resend2faCode()}>Resend code</button>
                </aside>

                <div id="div-2fa-form">
                    <form id="validation-2fa-form" autoComplete="off">
                        <h3>Enter the code you received by email</h3>
                        <input
                            type="text"
                            id="double_auth_code"
                            placeholder="Check your emails"
                            onChange={(event) => handleValidate2faChange(event)}
                            autoFocus
                            required
                        />
                        <div id="form-2fa-choices">
                            <input
                                type="submit"
                                className="button"
                                onClick={async (event) =>
                                    await submitValidate2faForm(event)
                                }
                                value="Validate"
                            />
                            <button onClick={() => cancel2fa()}>cancel</button>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
};
export default DoubleAuth;
