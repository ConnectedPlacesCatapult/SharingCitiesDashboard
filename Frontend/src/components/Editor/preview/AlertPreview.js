import React from 'react';
import PropTypes from 'prop-types';
import {
  Fade,
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
      loading: true,
      attributes: [],
      width: props.editor.widget.width,
      height: props.editor.widget.height,
    };

    props.getThemeTree();
  }

  componentWillReceiveProps(nextProps) {
    const { editor } = this.props;

    if (nextProps.editor.fetching !== editor.fetching) {
      this.setState({ loading: nextProps.editor.fetching })
    }

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
    const { error, loading } = this.state;

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
      <div className={classes.root} style={rootStyles}>
        <Fade in={!loading} mountOnEnter>
          <Table padding="none">
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">Attribute</TableCell>
                <TableCell>{this.getAttributeNameFromId(editor.widget.config.attributeId)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Minimum threshold</TableCell>
                <TableCell>{editor.widget.config.minThreshold}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Maximum threshold</TableCell>
                <TableCell>{editor.widget.config.maxThreshold}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Activated</TableCell>
                <TableCell>{editor.widget.config.activated.toString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Fade>
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
