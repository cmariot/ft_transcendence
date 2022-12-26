import React from 'react';
import axios from 'axios';

function App() {

	const [data, setData] = React.useState("");

	React.useEffect(() => {
		axios.get("http://0.0.0.0:3000")
			.then((response) => {setData(response);
		});
	}, []);


	return (
		<div>
			<h1>ft_transcendence</h1>
			<h2>{data.data}</h2>
		</div>
	);
}

export default App;
