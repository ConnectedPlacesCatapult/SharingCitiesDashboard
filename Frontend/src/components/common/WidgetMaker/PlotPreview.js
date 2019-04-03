import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { convertWideToRaw } from "../../../actions/widgetActions";
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';

const styles = (theme) => ({
  root: {

  },
  widget: {
    display: 'flex',
    alignItems: 'flexStart',
  },
});

class PlotPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    plotConfig: PropTypes.object.isRequired,
  };

  render() {
    const { classes, theme, plotConfig } = this.props;

    const titleTypography = theme.typography.body1;
    const labelTypography = theme.typography.body2;

    const spec = {
      ...plotConfig.spec,
      config: {
        axis: {
          // x & y axis lines
          domainColor: theme.palette.primary.main,

          // grid
          gridColor: theme.palette.primary.dark,

          // x & y axis labels
          labelColor: theme.palette.primary.main,
          labelFont: labelTypography.fontFamily,
          labelFontSize: parseFloat(labelTypography.fontSize) * theme.typography.fontSize,
          labelFontWeight: labelTypography.fontWeight,

          // axis titles
          titleColor: titleTypography.color,
          titleFont: titleTypography.fontFamily,
          titleFontSize: parseFloat(titleTypography.fontSize) * theme.typography.fontSize,
          titleFontWeight: titleTypography.fontWeight,
          titlePadding: theme.spacing.unit,

          tickColor: theme.palette.primary.main,
        },
        legend: {
          titleColor: titleTypography.color,
          titleFont: titleTypography.fontFamily,
          titleFontSize: parseFloat(titleTypography.fontSize) * theme.typography.fontSize,
          titleFontWeight: titleTypography.fontWeight,

          labelColor: theme.palette.primary.main,
          labelFont: labelTypography.fontFamily,
          labelFontSize: parseFloat(labelTypography.fontSize) * theme.typography.fontSize,
          labelFontWeight: labelTypography.fontWeight,
        },

        title: {
          color: theme.palette.primary.main,
          font: labelTypography.fontFamily,
          fontSize: parseFloat(labelTypography.fontSize) * theme.typography.fontSize,
          fontWeight: labelTypography.fontWeight,
        },
      },
    };

    const tooltipOptions = {
      theme: 'custom',
      styleId: 'customTooltip',

    };
    const tooltipHandler = new Handler(tooltipOptions);

    return (
      <div className={classes.root}>
        <VegaLite
          className={classes.widget}
          spec={spec}
          data={plotConfig.data}
          tooltip={tooltipHandler.call}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  plotConfig: state.widget.plotConfig,
});

const mapDispatchToProps = (dispatch) => ({
  convertWideToRaw: (wideData) => dispatch(convertWideToRaw(wideData)),
});

PlotPreview = withStyles(styles, { withTheme: true })(PlotPreview);
PlotPreview = connect(mapStateToProps, mapDispatchToProps)(PlotPreview);

export default PlotPreview
