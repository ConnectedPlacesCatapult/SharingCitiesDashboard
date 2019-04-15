import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {
  Typography,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import LoadingIndicator from './../../Widget/LoadingIndicator';

const FCC_CONFIG = require('./../../../../fcc.config');

const styles = (theme) => ({
  root: {

  },
});

class AlertPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      data: null,
      error: null,
      loading: true,
    }
  }

  componentWillMount() {
    this.fetchData()
  }

  componentDidUpdate(prevProps) {
    const { editor } = this.props;

    if (editor.widget.queryParams !== prevProps.editor.widget.queryParams) {
      this.fetchData()
    }
  }

  fetchData() {
    this.setState({
      data: [1, 2, 3, 4, 5],
      loading: false,
    })
  }

  render() {
    const { classes, editor } = this.props;
    const { data, error, loading } = this.state;

    if (loading) {
      return (
        <div className={classes.root}>
          <LoadingIndicator />
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <Typography variant="subtitle2">Alert Preview</Typography>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

AlertPreview = withStyles(styles)(AlertPreview);
AlertPreview = connect(mapStateToProps, null)(AlertPreview);

export default AlertPreview
