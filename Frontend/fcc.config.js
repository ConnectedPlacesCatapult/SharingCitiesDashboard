module.exports = {

  // root uri of the API
  apiRoot: 'https://heregoestheapiaddress.mkay/',

  // optionally include localisation stylesheet (good for @font-face stuff)
  localeStyleSheet:'./styles/lisbon.css',

  // overrides for MaterialUI default theme
  localeThemeData: {
    "palette": {
     //"type": "dark",
      "primary": {
        "light": "#d3edea",
        "main": "#81cfc7",
        "dark": "#32b1a4"
      },
      "secondary": {
        "light": "#FC554B",
        "main": "#D54A44",
        "dark": "#AE3C38"
      },
      "background": {
        "paper": "#313443",
        "default": "#42465a"
      }
    },
    "typography": {
      useNextVariants: true,
      "fontFamily": "'BrandonText', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    }
  },

  // currently used by the common/Header component to define links
  routes: [
    {
      path: "/",
      exact: true,
      component: "DashboardPage",
      name: "Dashboard",
    },
    {
      path: "/data",
      exact: false,
      component: "DataPage",
      name: "Data Viewer",
    },
    {
      path: "/builder",
      exact: false,
      component: "BuilderPage",
      name: "Plot Builder",
    }
  ],
};
