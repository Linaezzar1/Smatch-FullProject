import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../imgs/volleyball.jpg';
import { login } from '../../Services/UserService';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const response = await login({ email: form.email, password: form.password });
            const token = response.mytoken;

            // Décoder le token pour vérifier le rôle
            try {
                const payloadBase64 = token.split('.')[1];
                const decodedPayload = JSON.parse(atob(payloadBase64));
                const userRole = decodedPayload.role;

                if (!userRole) {
                    setError('Le token ne contient pas de rôle. Contactez l\'administrateur.');
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }

                if (userRole !== 'admin') {
                    setError('Seul un administrateur peut se connecter.');
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }
            } catch (decodeError) {
                setError('Erreur lors du décodage du token. Token invalide.');
                localStorage.removeItem('token');
                setLoading(false);
                return;
            }

            localStorage.setItem('userEmail', form.email);
            setTimeout(() => {
                navigate('/');
            }, 100);
        } catch (err) {
            setError('Échec de la connexion : ' + (err.message || 'Vérifiez vos identifiants'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="vh-100 container">
            <div className="container-fluid h-custom">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-md-9 col-lg-6 col-xl-5">
                        <img src={logo} className="img-fluid" alt="Sample" />
                    </div>
                    <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                        <form onSubmit={handleSubmit}>
                            <div className="form-welcome">
                                <h1>Bienvenue</h1>
                                <p>Ravi de te revoir !</p>
                            </div>

                            {error && <div className="text-danger mb-3">{error}</div>}

                            <div className="form-outline mb-4">
                                <input
                                    type="email"
                                    id="form3Example3"
                                    name="email"
                                    className="form-control form-control-lg"
                                    placeholder="Enter a valid email address"
                                    value={form.email}
                                    onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="form3Example3">
                                    Email address
                                </label>
                            </div>

                            <div className="form-outline mb-3">
                                <input
                                    type="password"
                                    id="form3Example4"
                                    name="password"
                                    className="form-control form-control-lg"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={handleChange}
                                />
                                <label className="form-label" htmlFor="form3Example4">
                                    Password
                                </label>
                            </div>

                            <div className="text-center text-lg-start mt-4 pt-2">
                                <button
                                    type="submit"
                                    className="btn-login"
                                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                    disabled={loading}
                                >
                                    {loading ? 'Connexion...' : 'Connexion'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;