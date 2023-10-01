// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS = {
  auth: '/auth',
  home: '/',
  admin: '/admin',
};

export const PATH_PAGE = {
  auth: {
    root: ROOTS.auth,
    login: path(ROOTS.auth, '/login'),
    loginUnprotected: path(ROOTS.auth, '/login-unprotected'),
    register: path(ROOTS.auth, '/register'),
    registerUnprotected: path(ROOTS.auth, '/register-unprotected'),
    resetPassword: path(ROOTS.auth, '/reset-password'),
    verify: path(ROOTS.auth, '/verify'),
    payment: path(ROOTS.auth, '/payment')
  },
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment'
};

export const PATH_ADMIN = {
  root: ROOTS.admin,
  sellers: path(ROOTS.admin, '/sellers'),
  products: path(ROOTS.admin, '/products'),
  clients: path(ROOTS.admin, '/clients'),
  sales: path(ROOTS.admin, '/sales'),
};

export const PATH_HOME = {
  root: ROOTS.home,
  sales: path(ROOTS.home, 'sales'),
  sale: path(ROOTS.home, 'sale'),
  invoices: path(ROOTS.home, 'invoices'),
  invoice: path(ROOTS.home, 'invoice'),
  invoiceview: path(ROOTS.home, 'invoiceview'),
};
