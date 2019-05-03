import React from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";
import {
  Paper,
  Typography,
  withStyles,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { connect } from 'react-redux';
import AlertPreview from './AlertPreview';
import ForecastPreview from './ForecastPreview';
import MapPreview from './MapPreview';
import PlotPreview from './PlotPreview';

const styles = (theme) => {
  const globalFontSize = getComputedStyle(document.documentElement).fontSize;
  const captionLineHeight = theme.typography.caption.lineHeight;
  const captionFontSize = theme.typography.caption.fontSize;
  const calculatedPadding = parseFloat(globalFontSize) * parseFloat(captionFontSize) * captionLineHeight + theme.spacing.unit;

  return {
    root: {
      padding: `${theme.spacing.unit}px ${calculatedPadding}px ${calculatedPadding}px ${theme.spacing.unit}px`,
      borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
      overflow: 'hidden',
      position: 'relative',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      color: theme.palette.text.primary,
      marginBottom: theme.spacing.unit,
    },
    headerIcon: {
      margin: `0 ${theme.spacing.unit}px`,
    },
    ruler: {
      position: 'absolute',
      display: 'flex',
      backgroundColor: theme.palette.primary.light,
    },
    rulerHeight: {
      top: 0,
      right: 0,
      width: 'auto',
      height: '100%',
      flexDirection: 'column',
      writingMode: 'vertical-rl',
      textOrientation: 'mixed',
      alignItems: 'center',
    },
    rulerWidth: {
      bottom: 0,
      left: 0,
      width: '100%',
      height: 'auto',
      flexDirection: 'row',
      justifyContent: 'center',
    },
  }
};

class PreviewWrapper extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
  };

  render() {
    const { classes, editor } = this.props;

    return (
      <Paper className={classes.root}>
        <div className={classes.header}>
          <SearchIcon className={classes.headerIcon} fontSize="small" />
          <Typography variant="subtitle1">Preview</Typography>
        </div>
        <Typography className={classNames(classes.ruler, classes.rulerHeight)} variant="caption" color='inherit'>&#8676; {Number(editor.widget.height)}px &#8677;</Typography>
        <Typography className={classNames(classes.ruler, classes.rulerWidth)} variant="caption" color='inherit'>&#8676; {Number(editor.widget.width)}px &#8677;</Typography>
        {editor.widget.type === "alert" && <AlertPreview />}
        {editor.widget.type === "forecast" && <ForecastPreview />}
        {editor.widget.type === "map" && <MapPreview />}
        {editor.widget.type === "plot" && <PlotPreview />}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

PreviewWrapper = withStyles(styles)(PreviewWrapper);
PreviewWrapper = connect(mapStateToProps, null)(PreviewWrapper);

export default PreviewWrapper
