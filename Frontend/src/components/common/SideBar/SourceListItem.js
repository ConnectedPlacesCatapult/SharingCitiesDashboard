import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import { connect } from 'react-redux';
import { setCurrentDatasource, fetchData } from './../../../actions/datasourceActions';

const styles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
  darkColor: {
    color: theme.palette.primary.dark,
  },
});

class SourceListItem extends Component {
  handleClick = name => e => {
    this.props.setCurrentDatasource(name);
    this.props.fetchData();
  };

  render() {

    console.log(this.props);

    const { classes, name } = this.props;
    const { datasource } = this.props.datasource;

    return (
      <div>
        <ListItem button className={classes.nested} onClick={this.handleClick(name)}>
          {
            datasource === name
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
  datasource: PropTypes.object.isRequired,
  setCurrentDatasource: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    datasource: state.datasource,
  }
};

const mapDispatchToProps = {
  setCurrentDatasource,
  fetchData,
};

SourceListItem = withStyles(styles)(SourceListItem);
export default connect(mapStateToProps, mapDispatchToProps)(SourceListItem);
