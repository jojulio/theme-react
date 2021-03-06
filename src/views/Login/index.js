import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FaEnvelope, FaArrowRight, FaLock } from 'react-icons/fa';

import api from '../../services/api';
import { login } from '../../services/auth';

function initialState() {
	return { email: 'julio@email.com', password: '123' };
}

const Login = () => {
	const [values, setValues] = useState(initialState);
	const [error, setError] = useState();
	const history = useHistory();

	function onChange(e) {
		const { value, name } = e.target;
		setValues({
			...values,
			[name]: value
		});
	}

	async function onSubmit(e) {
		e.preventDefault();

		const { email, password  } = values;
		
		if (!email || !password) {
			setError('Preencha e-mail e senha para continuar');
		} else {
			try {
				const sessions = await api.post('/sessions', { email, password });
				const token = sessions.data.token;
				const refreshToken = sessions.data.refreshToken;
				const user = await api.get('/sessions/user', { headers: { Authorization: 'Bearer '.concat(token) } });
				
				login({ 
					token, 
					refreshToken, 
					username: user.data.username, 
					permission: user.data.permission 
				});

				history.push('/');
			} catch (err) {
				console.error(err);
				setError('Login e senha inválido');
				setValues(initialState);
			}
		}
	}

	return (
		<div className="login-area">
			<div className="container">
				<div className="login-box ptb--100">
					<form onSubmit={onSubmit}>
						<div className="login-form-head">
							<h4>Login</h4>
						</div>
						<div className="login-form-body">
							<div className="form-gp focused">
								<label htmlFor="email">E-mail</label>
								<input type="email" name="email" onChange={onChange} value={values.email} />
								<FaEnvelope />
							</div>
							<div className="form-gp focused">
								<label htmlFor="password">Senha</label>
								<input type="password" name="password" onChange={onChange} value={values.password} />
								<FaLock />
							</div>
							<div className="submit-btn-area">
								<button id="form_submit" type="submit">Entrar <FaArrowRight /> </button>
							</div>
							{error && ( <div className="error-message">{error}</div>)}
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;