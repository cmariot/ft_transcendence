import axios from "axios";
import "../CSS/Settings.css";
import "../CSS/Theme.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

export default function EditProfilePicture() {
    const user = useContext(UserContext);
    const navigate = useNavigate();

    function uploadImage(event: any) {
        event.preventDefault();
        if (event.target.files[0]) {
            const formData = new FormData();
            formData.append("file", event.target.files[0]);
            axios
                .post("/api/profile/update/image", formData, {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                })
                .then(() => {
                    user.editAvatar(URL.createObjectURL(event.target.files[0]));
                    navigate("/settings");
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <div id="edit-picture">
            <img
                src={user.avatar}
                id="edit-picture-img"
                alt="Edit your avatar"
            />
            <label id="label-edit-picture">
                <p>Edit Profile Picture</p>
                <input
                    type="file"
                    id="edit-picture-input"
                    accept="image/*"
                    onChange={uploadImage}
                />
            </label>
        </div>
    );
}
