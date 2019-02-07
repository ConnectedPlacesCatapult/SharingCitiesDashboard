import React from 'react';
import PropTypes from 'prop-types';

import { QUERY_PARAMS } from './../../../constants';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

// redux
import { connect } from 'react-redux';
import { fetchAttributeData } from "../../../actions/apiActions";

const styles = (theme) => ({
  root: {

  },
  nested: {
    paddingLeft: theme.spacing.unit * 6,
  },
});

class AttributeListItem extends React.Component {
  handleClick = () => {
    // toggle isSelected
    this.props.onClick();

    const queryParams = {
      [QUERY_PARAMS.GROUPED]: true,
      [QUERY_PARAMS.HARMONISING_METHOD]: QUERY_PARAMS.HARMONISING_METHOD_LONG,
      [QUERY_PARAMS.LIMIT]: 100,
      [QUERY_PARAMS.PER_SENSOR]: true,
    };

    // fire off call for fresh data
    this.props.fetchAttributeData(this.props.themeId, this.props.subthemeId, queryParams);
  };

  render() {
    const { classes, attributeName, isSelected } = this.props;

    return (
      <ListItem button className={classes.nested} onClick={this.handleClick}>
        {
          isSelected
            ? <RadioButtonCheckedIcon fontSize="small" color="primary" />
            : <RadioButtonUncheckedIcon fontSize="small" color="primary" />
        }
        <ListItemText inset primary={attributeName} />
      </ListItem>
    )
  }
}

AttributeListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  subthemeId: PropTypes.number.isRequired,
  attributeId: PropTypes.string.isRequired,
  attributeName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  data: PropTypes.array.isRequired,
  fetchAttributeData: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  data: state.api.data,
});

const mapDispatchToProps = (dispatch) => ({
  fetchAttributeData: (themeId, subthemeId, queryParams) => dispatch(fetchAttributeData(themeId, subthemeId, queryParams)),
});

AttributeListItem = withStyles(styles)(AttributeListItem);
AttributeListItem = connect(mapStateToProps, mapDispatchToProps)(AttributeListItem);

export default AttributeListItem
