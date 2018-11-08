import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { connect } from 'react-redux';
import { fetchData } from "../../../actions/dataActions";
import {toggleSourceSelected} from "../../../actions/sourcesActions";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  darkColor: {
    color: theme.palette.primary.dark,
  },
});

class SourceListItem extends Component {
  handleClick = () => {
    const { name, theme, meta, onClick, fetchData } = this.props;

    // only handles whether source is selected or not
    onClick();

    // data needed for API call
    const requestData = {
      source: name,
      theme,
      meta,
    };

    console.log(requestData);

    fetchData(requestData)
  };

  render() {
    const { classes, name, isSelected } = this.props;

    return (
      <div>
        <ListItem button className={classes.nested} onClick={this.handleClick}>
          {
            isSelected
              ? <RadioButtonCheckedIcon fontSize="small" color="secondary" />
              : <RadioButtonUncheckedIcon fontSize="small" className={classes.darkColor} />
          }
          <ListItemText inset primary={name} />
        </ListItem>
      </div>
    )
  }
}

SourceListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  theme: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  fetchData: requestData => dispatch(fetchData(requestData)),
});

SourceListItem = withStyles(styles)(SourceListItem);
export default connect(mapStateToProps, mapDispatchToProps)(SourceListItem);
