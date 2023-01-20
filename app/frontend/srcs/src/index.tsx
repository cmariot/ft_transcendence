import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Main from './layouts/main';
import  { BrowserRouter } from "react-router-dom";


ReactDOM.render(
	<React.StrictMode>
	  <BrowserRouter>
		<Main />
	  </BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);