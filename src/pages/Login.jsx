import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import IconInput from '../components/IconInput';
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import Alert from "../components/alert";
import Loader from "../components/loader";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Controlla se l'utente è già loggato al montaggio del componente
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard', { replace: true });
      }
      setLoading(false); // Sessione controllata
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <>
      {error && (
        <Alert
          Type="error"
          Title="Errore"
          Description="Username o password non esistente"
          onClose={() => setError("")}
          Modal={true}
        />
      )}
      {/* Loader overlay */}
      {loading && (
        <div className="loader-overlay">
          <Loader />
        </div>
      )}
      <div className='Login_MainDiv'>
        <div className='Login_LeftPart'>
          <div className='Login_LeftPart_Form'>
            <p>Bentornato!</p>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
              <div>
                <label>Email:</label><br />
                <IconInput
                  icon={<MdEmail />}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Password:</label><br />
                <IconInput
                  icon={<TbLockPassword />}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className='flex row width100 centerx'>
                <button type="submit">Accedi</button>
              </div>
            </form>
          </div>
        </div>
        <div className='Login_RightPart'>
          <img src="images/logo/grande/logo_white.png" alt="logo" />
        </div>
      </div>
    </>
  );
};

export default Login;
