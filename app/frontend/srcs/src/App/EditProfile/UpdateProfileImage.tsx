import axios from "axios";
import React from "react";

class UpdateProfileImage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            updateDate: Date.now(),
        };
    }

    uploadImage(event) {
        event.preventDefault();
        const formData = new FormData();
        formData.append("file", event.target.files[0]);
        axios
            .post("/api/profile/update/image", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div>
                <img src="/api/profile/image" />
                <input
                    type="file"
                    accept="image/*"
                    onChange={this.uploadImage}
                />
            </div>
        );
    }
}

export default UpdateProfileImage;
