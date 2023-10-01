import React from 'react';
import { MLabel, MIcon } from 'src/theme';
import { PATH_HOME } from 'src/routes/paths';

// ----------------------------------------------------------------------

const path = (name) => `/static/icons/navbar/${name}.svg`;

const ICONS = {
  authenticator: <MIcon src={path('ic_authenticator')} />,
  blog: <MIcon src={path('ic_blog')} />,
  calendar: <MIcon src={path('ic_calendar')} />,
  cart: <MIcon src={path('ic_cart')} />,
  charts: <MIcon src={path('ic_charts')} />,
  chat: <MIcon src={path('ic_chat')} />,
  components: <MIcon src={path('ic_components')} />,
  dashboard: <MIcon src={path('ic_dashboard')} />,
  editor: <MIcon src={path('ic_editor')} />,
  elements: <MIcon src={path('ic_elements')} />,
  error: <MIcon src={path('ic_error')} />,
  mail: <MIcon src={path('ic_mail')} />,
  map: <MIcon src={path('ic_map')} />,
  page: <MIcon src={path('ic_page')} />,
  user: <MIcon src={path('ic_user')} />,
  upload: <MIcon src={path('ic_upload')} />,
  copy: <MIcon src={path('ic_copy')} />,
  carousel: <MIcon src={path('ic_carousel')} />,
  language: <MIcon src={path('ic_language')} />
};

const navConfig = [
  {
    items: [
      {
        title: 'Inicio',
        href: PATH_HOME.root,
        icon: ICONS.dashboard,
      },
      {
        title: 'Ventas',
        href: PATH_HOME.sales,
        icon: ICONS.cart,
      },
      {
        title: 'Presupuestos',
        href: PATH_HOME.invoices,
        icon: ICONS.elements,
      }
      /* {
        title: 'Nueva venta',
        href: PATH_HOME.sale,
        icon: ICONS.dashboard
      } */
    ]
  },
];

export default navConfig;
