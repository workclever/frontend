const CracoAntDesignPlugin = require("craco-antd");

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          "@primary-color": "#8445BC",
          "@font-family": "'Open Sans', sans-serif",
          "@border-radius-base": "4px",

          // "@body-background": "#0E1117",
          // "@component-background": "#0E1117",
          // "@layout-body-background": "#0E1117",
          // "@layout-header-background": "blue",
          // "@text-color": "white",
          // "@text-color-secondary": "#666672",

          // "@table-header-bg": "transparent",
          // "@table-body-sort-bg": "#0E1117",
          // "@table-row-hover-bg": "#161b22",
          // "@table-header-cell-split-color": "rgb(33, 38, 45)",
          // "@table-expanded-row-bg": "transparent",

          // "@heading-color": "white",

          // "@modal-content-bg": "#0E1117",
          // "@modal-header-bg": "#0E1117",

          // "@border-color-base": "rgb(33, 38, 45)",
          // "@border-color-split": "rgb(33, 38, 45)",

          "@alert-success-bg-color": "#C1E0C5",
          "@alert-success-border-color": "#4BA46D",
          // "@alert-info-bg-color": "#111b26",
          // "@alert-info-border-color": "#153450",
          "@alert-error-bg-color": "#F9C6C6",
          "@alert-error-border-color": "#DC3D43",

          // "@input-placeholder-color": "transparent",
          // "@input-number-handler-active-bg": "#161b22",

          // "@select-selection-item-bg": "#161b22",
          // "@select-item-hover-bg": "#161b22",
          // "@select-item-selected-bg": "#12171d",
          // "@select-item-active-bg": "#12171d",

          // "@icon-color": "rgb(102, 102, 114)",
          // "@icon-color-hover": "#939399",

          // "@btn-primary-color": "#0d1117",
          // "@btn-primary-bg": "#6643fe",
          // "@btn-disable-color": "#666672",
          // "@btn-disable-bg": "#21262e",

          // "@menu-item-active-bg": "#30363d",
          // "@menu-item-color": "rgb(240, 246, 252)",
          // "@menu-item-active-border-width": "0px",
          // "@menu-highlight-color": "rgb(240, 246, 252)",
        },
      },
    },
  ],
};
