import axios from "axios";
import "../../styles/Settings.css";
import "../../styles/Theme.css";
import { useContext } from "react";
import { UserContext } from "../../Contexts/UserProvider";

export default function EditProfilePicture() {
    const user = useContext(UserContext);

    async function uploadImage(event: any) {
        event.preventDefault();
        if (event.target.files[0]) {
            const formData = new FormData();
            formData.append("file", event.target.files[0]);
            await axios
                .post("/api/profile/update/image", formData, {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                })
                .then(() => {
                    user.editAvatar(URL.createObjectURL(event.target.files[0]));
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    return (
        <div id="edit-picture">
            {user.avatar && (
                <img
                    src={user.avatar}
                    id="edit-picture-img"
                    alt="Edit your avatar"
                />
            )}
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
