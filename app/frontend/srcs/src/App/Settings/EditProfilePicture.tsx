import axios from "axios";
import "../CSS/Settings.css";

export default function EditProfilePicture(props) {
    function uploadImage(event) {
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
                    props.user["setUserImage"](
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
            <img
                src={props.user["userImage"]}
                id="edit-picture-img"
                alt="preview image"
            />
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
