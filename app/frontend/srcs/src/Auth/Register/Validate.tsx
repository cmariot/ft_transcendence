import axios from "axios";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        console.log("On submit code = ", code);
        console.log(event);
        await axios
            .post("/api/register/validate", {
                code: code,
            })
            .then(function (response) {
                navigate("/");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const cancelRegister = async (event) => {
        event.preventDefault();
        await axios
            .get("/api/register/cancel")
            .then(function (response) {
                navigate("/login");
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    return (
        <main id="validation-main">
            <article>
                <h2>Validate your account</h2>
                <p>Check your emails, we just send you a verification code.</p>
            </article>

            <aside>
                <h3>Enter the code you received by email</h3>
                <form id="email-validation-form">
                    <input
                        type="text"
                        id="code"
                        placeholder="Check your emails"
                        onChange={handleValidateChange}
                    />
                    <input
                        type="submit"
                        className="button"
                        onClick={submitValidateForm}
                        value="Validate"
                    />
                    <button onClick={cancelRegister}>cancel</button>
                </form>
            </aside>
        </main>
    );
};
export default Validate;
