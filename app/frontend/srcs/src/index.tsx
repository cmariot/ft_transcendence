import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import ReactDOM from 'react-dom/client';
import ProtectedRoute from './util/ProtectedRoute';
import Home from './home/home/Home';
import React from 'react';
import Login from './auth/Login';
import Register from './auth/Register';
import './index.css'

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
  );
  root.render(
	<React.StrictMode>
		<BrowserRouter basename={'/'}>
    		<Routes>

        		<Route path='/login' element={<Login />}/>
        		<Route path='/register' element={<Register />}/>
        		
				<Route path="/" element={<App />}>
            		<Route path='' element={
                		<ProtectedRoute>
                 			<Home />
                		</ProtectedRoute>
            		} />
        		</Route>
			
			</Routes>
		</BrowserRouter>	
	</React.StrictMode>
  );