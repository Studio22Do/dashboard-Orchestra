import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const inputStyle = {
  padding: '16px',
  borderRadius: 12,
  border: '1px solid #837CF3',
  background: 'rgba(255,255,255,0.15)',
  color: 'white',
  marginBottom: 8,
  fontSize: '1rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
};

const buttonStyle = {
  marginTop: 8,
  backgroundColor: 'rgb(139, 105, 234)',
  color: 'white',
  borderRadius: 12,
  padding: '12px 0',
  fontSize: '1rem',
  fontWeight: 500,
  boxShadow: 'rgba(80, 76, 148, 0.25) 0px 1.46822px 5.59533px -0.978815px, rgba(0, 0, 0, 0.07) 0px 0.978815px 0.978815px 0px, rgba(0, 0, 0, 0.06) 0px 0.489407px 2.44704px 0px',
  border: 'none',
  width: '100%',
  cursor: 'pointer',
};

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setMsg(data.message || data.error);
    } catch (err) {
      setMsg('Error al restablecer la contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #05041B 0%, #7A62BA 100%)',
      padding: 16
    }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <img src="/maestro.png" alt="Logo Sympho" style={{ width: 290, marginBottom: 24 }} />
      </div>
      <form onSubmit={handleSubmit} style={{
        // background: '#221c3a',
        padding: 32,
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}>
        <h2 style={{ fontSize: 18, color: 'white', marginBottom: 16, fontWeight: 400 }}>Restablecer contraseña</h2>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Restableciendo...' : 'Restablecer contraseña'}
        </button>
        {msg && <div style={{ color: msg.includes('error') ? '#f87171' : '#4ade80', textAlign: 'center', marginTop: 8 }}>{msg}</div>}
        <a href="/login" style={{ color: '#837CF3', fontSize: 14, textAlign: 'center', marginTop: 8 }}>Volver al login</a>
      </form>
    </div>
  );
};

export default ResetPassword; 