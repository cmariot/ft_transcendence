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

<<<<<<< HEAD
    const submitValidateForm = async (event: any) => {
        event.preventDefault();
=======
    const submitValidateForm = async () => {
>>>>>>> 6516be0facb0472989df2c502fc3b7ade8919996
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

<<<<<<< HEAD
    const resendCode = async (event: any) => {
        event.preventDefault();
=======
    const resendCode = async () => {
>>>>>>> 6516be0facb0472989df2c502fc3b7ade8919996
        await axios.get("/api/register/resend").catch(function (error) {
            console.log(error);
        });
    };

<<<<<<< HEAD
    const cancelRegister = async (event: any) => {
        event.preventDefault();
=======
    const cancelRegister = async () => {
>>>>>>> 6516be0facb0472989df2c502fc3b7ade8919996
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
        <section id="validation-section">
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
    );
};
export default Validate;
