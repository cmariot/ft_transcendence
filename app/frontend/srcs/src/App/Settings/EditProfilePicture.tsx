import axios from "axios";
import { useState } from "react";
import "../CSS/Settings.css";

export default function EditProfilePicture(props) {
    const [image, setImage] = useState(props.userProps.userImage);

    function uploadImage(event) {
        event.preventDefault();
        const formData = new FormData();
        if (event.target.files[0]) {
            formData.append("file", event.target.files[0]);
            setImage(URL.createObjectURL(event.target.files[0]));
            axios
                .post("/api/profile/update/image", formData, {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    console.log(event.target.files[0]);
                    props.userProps.setUserImage(
                        URL.createObjectURL(event.target.files[0])
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <div id="edit-picture">
            <img src={image} id="edit-picture-img" alt="preview image" />
            <label>
                Edit Profile Picture
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
