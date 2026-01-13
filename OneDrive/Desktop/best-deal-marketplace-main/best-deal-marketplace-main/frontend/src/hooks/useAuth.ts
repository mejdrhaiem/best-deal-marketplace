import { useState, useEffect } from 'react';
import api from '@/lib/api';

interface User {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
}

interface UserMetadata {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  address: string | null;
  isAdmin: boolean;
}

interface Profile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  is_admin: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get('/auth/user');
      if (data.user) {
          setUser(data.user);
          const p = data.user.user_metadata;
          if (p) {
              setProfile({
                  id: p.id,
                  user_id: p.userId,
                  first_name: p.firstName,
                  last_name: p.lastName,
                  phone: p.phone,
                  address: p.address,
                  is_admin: p.isAdmin
              });
          }
      }
    } catch (err) {
      console.error(err);
      localStorage.removeItem('access_token');
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email: string, password: string, data?: { firstName?: string; lastName?: string; phone?: string; address?: string }) {
    const { data: res } = await api.post('/auth/signup', { email, password, ...data });
    localStorage.setItem('access_token', res.session.access_token);
    setUser(res.session.user);
    const p = res.session.user.user_metadata;
    if (p) {
        setProfile({
            id: p.id,
            user_id: p.userId,
            first_name: p.firstName,
            last_name: p.lastName,
            phone: p.phone,
            address: p.address,
            is_admin: p.isAdmin
        });
    }
    return { user: res.session.user };
  }

  async function signIn(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('access_token', data.session.access_token);
    setUser(data.session.user);
    const p = data.session.user.user_metadata;
    if (p) {
        setProfile({
            id: p.id,
            user_id: p.userId,
            first_name: p.firstName,
            last_name: p.lastName,
            phone: p.phone,
            address: p.address,
            is_admin: p.isAdmin
        });
    }
    return { user: data.session.user };
  }

  async function signOut() {
    localStorage.removeItem('access_token');
    setUser(null);
    setProfile(null);
  }

  return {
    user,
    profile,
    loading,
    isAdmin: profile?.is_admin ?? false,
    signUp,
    signIn,
    signOut,
  };
}
