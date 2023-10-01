import React from 'react';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import { PATH_HOME, PATH_ADMIN } from 'src/routes/paths';
import { Redirect } from 'react-router-dom';
import LoadingScreen from 'src/components/LoadingScreen';

// ----------------------------------------------------------------------

GuestProtect.propTypes = {
  children: PropTypes.node
};

function GuestProtect({ children }) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    if (user.rol === 'admin') {
      return <Redirect to={PATH_ADMIN.root} />;
    }
    return <Redirect to={PATH_HOME.root} />;
  }


  return <>{children}</>;
}

export default GuestProtect;
