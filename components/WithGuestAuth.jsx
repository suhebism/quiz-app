'use client';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from './Loading';

const WithGuestAuth = (Component) => {
  return function GuestAuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user) {
        // Redirect to home or desired page if user is already logged in
        router.push('/');
      }
    }, [loading, user, router]);

    // Render the component or a loading indicator
    return loading ? <Loading/> : <Component {...props} />;
  };
};

export default WithGuestAuth;
