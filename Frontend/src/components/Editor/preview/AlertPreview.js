import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import { getThemeTree } from './../../../actions/editorActions';
import LoadingIndicator from './../../Widget/LoadingIndicator';

const styles = (theme) => ({
  root: {
    transition: 'all 0.2s ease',
    width: 'auto',
    height: '100%',
    maxWidth: 0,
    maxHeight: 0,
    overflow: 'hidden',
  },
  cellValue: {
    color: theme.palette.primary.main,
    textAlign: 'right',
  },
  cellTriggered: {
    color: theme.palette.secondary.main,
    textAlign: 'right',
  },
});

class AlertPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    getThemeTree: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      loading: false,
      attributes: [],
      width: props.editor.widget.width,
      height: props.editor.widget.height,
    };

    props.getThemeTree();
  }

  componentWillReceiveProps(nextProps) {
    const { editor } = this.props;

    if (nextProps.editor.themeTree !== editor.themeTree) {
      const attributes = nextProps.editor.themeTree.reduce((arr, theme) => {
        theme['sub_themes'].map((subtheme) => {
          subtheme.attributes.map((attribute) => {
            arr = [...arr, {
              id: attribute['id'],
              themeId: attribute['theme_id'],
              subthemeId: attribute['sub_theme_id'],
              name: attribute['name'],
              description: attribute['Description'],
              unit: attribute['Unit'],
              unitValue: attribute['Unit Value'],

            }];
          })
        });

        return arr
      }, []);

      this.setState({ attributes })
    }
  }

  getAttributeNameFromId = (attributeId) => {
    const { attributes } = this.state;

    const found = attributes.find((attribute) => attribute.id === attributeId);

    return found ? found.name : '';
  };

  render() {
    const { classes, editor } = this.props;
    const { loading } = this.state;

    if (loading) {
      return (
        <div className={classes.root}>
          <LoadingIndicator />
        </div>
      )
    }

    const rootStyles = {
      width: `${editor.widget.width}px`,
      height: `${editor.widget.height}px`,
      maxWidth: `${editor.widget.width}px`,
      maxHeight: `${editor.widget.height}px`,
    };

    return (
      <div className={classes.root}  style={rootStyles}>
        <Table padding="none">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row">Attribute</TableCell>
              <TableCell className={classes.cellValue}>{this.getAttributeNameFromId(editor.widget.config.attributeId)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Alert type</TableCell>
              <TableCell className={classes.cellValue}>{editor.widget.config.type} threshold</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Threshold value</TableCell>
              <TableCell className={classes.cellValue}>{editor.widget.config.value}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">Status</TableCell>
              {editor.widget.config.triggered.toString() === 'true'
                ? <TableCell className={classes.cellTriggered}>{editor.widget.config.triggerEvent.message}<br />at {editor.widget.config.triggerEvent.timestamp}</TableCell>
                : <TableCell className={classes.cellValue}>active</TableCell>
              }
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  getThemeTree: () => dispatch(getThemeTree()),
});

AlertPreview = withStyles(styles)(AlertPreview);
AlertPreview = connect(mapStateToProps, mapDispatchToProps)(AlertPreview);

export default AlertPreview
