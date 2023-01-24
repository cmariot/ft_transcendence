import axios from "axios";
import { ChangeEvent, useEffect, useState } from "react";

function Profile() {

	const [username, setUsername] = useState("");
	const [newUsername, setNewUsername] = useState("");
	const [email, setEmail] = useState("");

	useEffect(() => {
		const getProfile = async function () {
			const response = await axios.get("https://localhost:8443/api/profile");
			setUsername(response.data.username);
			setEmail(response.data.email)
			setNewUsername("")
		}
		getProfile();
	}, [])

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target;
		if (id === "newUsername") {
			setNewUsername(value);
		}
	};

	const handleSubmit = async () => {
		await axios.post(
			'https://localhost:8443/api/profile/update/username',
			{ username: newUsername }
		)
			.then(async function (response) {
				console.log(response);
				let newProfile = await axios.get("https://localhost:8443/api/profile");
				setUsername(newProfile.data.username);
				setNewUsername("")
			})
			.catch(function (error) {
				console.log(error);
			})

	};

	const [file, setFile] = useState()
	function handleChange(event) {
		setFile(event.target.files[0])
	}
	function handleUpload(event) {
		event.preventDefault()
		const url = 'https://localhost:8443/api/profile/update/image';
		const formData = new FormData();
		formData.append('file', file);
		const config = {
			headers: {
				'content-type': 'multipart/form-data',
			},
		};
		axios.post(url, formData, config).then((response) => {
			console.log(response.data);
		});

	}

	return (
		<div>
			<h1>Welcome {username}</h1>

			<div>

				<p>Profile picture</p>
				<form onSubmit={handleUpload}>
					<input type="file" onChange={handleChange} />
					<button type="submit">Upload</button>
				</form>

				<p>username : {username}</p>
				<div>
					<div className="username">
						<label className="form__label" htmlFor="username">
							Username{""}
						</label>
						<input
							className="form__input"
							type="text"
							value={newUsername}
							onChange={(e) => handleInputChange(e)}
							id="newUsername"
							placeholder="New Username"
						/>
					</div>
					<button
						onClick={() => handleSubmit()}
						type="submit"
						className="btn"
					>
						Change Username
					</button>
				</div>

				<p>email : {email}</p>
			</div>
		</div>
	)
}

export default Profile;
