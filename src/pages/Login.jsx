import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import IconInput from '../components/IconInput';
import { MdEmail } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Controlla se l'utente è già loggato al montaggio del componente
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      // Dopo il login, reindirizza all'area protetta
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <>
      <div className='Login_MainDiv'>
        <div className='Login_LeftPart'>
          <div className='Login_LeftPart_Form'>
            <p>Bentornato!</p>
            <h1>Login</h1>

            {error && <p >Errore: {error}</p>}
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
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={true}
                />
              </div>
              <div className='flex row width100 centerx'>
                <button type="submit">Accedi</button>
              </div>
            </form>
          </div>
        </div>
        <div className='Login_RightPart'>
          <img src="images/logo/grande/logo_white.png" alt="logo"></img>
        </div>
      </div>
    </>
  );
};

export default Login;
