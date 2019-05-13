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
import {
  getThemeTree,
  setWidgetConfigProperty,
} from './../../../actions/editorActions';
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

class ForecastPreview extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    editor: PropTypes.object.isRequired,
    getThemeTree: PropTypes.func.isRequired,
    setWidgetConfigProperty: PropTypes.func.isRequired,
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
                <TableCell component="th" scope="row">Attribute to Track</TableCell>
                <TableCell>{editor.widget.queryParams.attributedata}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">Number of Predictions</TableCell>
                <TableCell>{editor.widget.queryParams.n_predictions}</TableCell>
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
  setWidgetConfigProperty: (property, value) => dispatch(setWidgetConfigProperty(property, value)),
});

ForecastPreview = withStyles(styles)(ForecastPreview);
ForecastPreview = connect(mapStateToProps, mapDispatchToProps)(ForecastPreview);

export default ForecastPreview
