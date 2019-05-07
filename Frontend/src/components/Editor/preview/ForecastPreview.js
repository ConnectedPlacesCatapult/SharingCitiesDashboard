import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
  withStyles,
} from '@material-ui/core';
import axios from 'axios';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';
import { connect } from 'react-redux';
import { setWidgetConfigProperty } from './../../../actions/editorActions';
import LoadingIndicator from './../../Widget/LoadingIndicator';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {

  },
});

const tooltipOptions = {
  theme: 'custom',
  styleId: 'customTooltip',
};

class ForecastPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { theme, editor } = props;

    const titleTypography = theme.typography.body1;
    const labelTypography = theme.typography.body2;

    this.state = {
      loading: null,
      error: null,
      // ToDo :: add queryParams from editor here?
      queryParams: editor.widget.queryParams,
      data: null,
      spec: {
        // ...editor.widget.config.spec,
        // width: editor.widget.width,
        // height: editor.widget.height,
        config: {
          axis: {
            // x & y axis lines
            domainColor: theme.palette.primary.main,

            // grid
            gridColor: theme.palette.primary.main,

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
      },
    };

    this.tooltipHandler = new Handler(tooltipOptions)
  }

  componentWillMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    if (this.props.editor.widget.queryParams !== prevProps.editor.widget.queryParams) {
      this.fetchData()
    }
  }

  fetchData = () => {
    const { editor, setWidgetConfigProperty } = this.props;

    this.setState({ loading: true });

    axios({
      url: FCC_CONFIG.apiRoot + '/data',
      method: 'get',
      params: editor.widget.queryParams,
    })
      .then((response) => {
        // also store in editor state so PlotConfig can access it?
        setWidgetConfigProperty('data', { values: response.data });

        this.setState({
          loading: false,
          data: {
            values: response.data,
          }
        })
      })
      .catch((err) => {
        this.setState({ error: err})
      })
  };

  render() {
    const { classes, editor } = this.props;
    const { spec, loading, error, data } = this.state;

    if (loading) {
      return <LoadingIndicator />
    }

    // ToDo :: sort this out so it updates ok (check old
    // ToDo :: add size transition for wrapper

    const fullSpec = {
      ...spec,
      ...editor.widget.config.spec,
      width: editor.widget.width,
      height: editor.widget.height,
    };

    return (
      <div className={classes.root}>
        <Fade in={!loading} mountOnEnter>
          <VegaLite
            className={classes.root}
            spec={fullSpec}
            data={data}
            tooltip={this.tooltipHandler.call}
          />
        </Fade>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

ForecastPreview = withStyles(styles, { withTheme: true })(ForecastPreview);
ForecastPreview = connect(mapStateToProps, mapDispatchToProps)(ForecastPreview);

export default ForecastPreview
