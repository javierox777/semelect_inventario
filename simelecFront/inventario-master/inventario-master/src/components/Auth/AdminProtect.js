import React from 'react';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import { Redirect } from 'react-router-dom';
import { PATH_PAGE, PATH_HOME } from 'src/routes/paths';
import LoadingScreen from 'src/components/LoadingScreen';
import user from 'src/redux/slices/user';

// ----------------------------------------------------------------------

AdminProtect.propTypes = {
  children: PropTypes.node
};

function AdminProtect({ children }) {
  const { isLoading, isAuthenticated, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect to={PATH_PAGE.auth.login} />;
  }

  if (user.role !== 'admin') {
    return <Redirect to={PATH_HOME.root} />;
  }

  return <>{children}</>;
}

export default AdminProtect;
