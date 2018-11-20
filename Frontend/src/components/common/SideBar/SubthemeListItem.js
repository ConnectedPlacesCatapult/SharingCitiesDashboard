import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { connect } from 'react-redux';
import { fetchData, purgeData } from "../../../actions/dataActions";

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  darkColor: {
    color: theme.palette.primary.dark,
  },
});

class SubthemeListItem extends React.Component {
  handleClick = () => {
    if (this.props.isSelected) {
      this.props.purgeData()
    } else {
      const request = {
        subtheme: this.props.subthemeName,
        theme: this.props.themeName,
        meta: this.props.subthemeMeta,
      };

      this.props.fetchData(request)
    }

    this.props.onClick();
  };

  render() {
    const { classes, subthemeName, isSelected } = this.props;

    return (
      <ListItem button className={classes.nested} onClick={this.handleClick}>
        {
          isSelected
            ? <RadioButtonCheckedIcon fontSize="small" color="secondary" />
            : <RadioButtonUncheckedIcon fontSize="small" className={classes.darkColor} />
        }
        <ListItemText inset primary={subthemeName} />
      </ListItem>
    )
  }
}

SubthemeListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  subthemeName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  purgeData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
  fetchData: request => dispatch(fetchData(request)),
  purgeData: () => dispatch(purgeData()),
});

SubthemeListItem = withStyles(styles)(SubthemeListItem);

export default connect(mapStateToProps, mapDispatchToProps)(SubthemeListItem)
