import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/admin/dashboard'); // Redirect to the admin dashboard
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div style={{ width: '400px', margin: 'auto', marginTop: '100px' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]} // No social providers, just email/password
        theme="dark"
      />
    </div>
  );
};

export default AdminLogin;
