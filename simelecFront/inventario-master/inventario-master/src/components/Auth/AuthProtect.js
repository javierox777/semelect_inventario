import React from 'react';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import { Redirect } from 'react-router-dom';
import { PATH_PAGE, PATH_ADMIN } from 'src/routes/paths';
import LoadingScreen from 'src/components/LoadingScreen';

// ----------------------------------------------------------------------

AuthProtect.propTypes = {
  children: PropTypes.node
};

function AuthProtect({ children }) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect to={PATH_PAGE.auth.login} />;
  }

  if (user.role !== 'seller') {
    return <Redirect to={PATH_ADMIN.root} />;
  }

  return <>{children}</>;
}

export default AuthProtect;
