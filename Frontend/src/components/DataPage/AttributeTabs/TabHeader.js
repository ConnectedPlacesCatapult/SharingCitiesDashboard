import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Tab,
  withStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import {
  removeAttributeData,
  toggleAttributeSelected,
} from "../../../actions/apiActions";

const styles = (theme) => ({
  label: {
    fontSize: '0.875rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    paddingRight: theme.spacing.unit,
  },
});

class TabHeader extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    attributeId: PropTypes.string.isRequired,
    attributeName: PropTypes.string.isRequired,
    toggleAttributeSelected: PropTypes.func.isRequired,
  };

  handleClick = (e) => {
    this.props.onChange(e, this.props.value)
  };

  handleCloseClick = (e) => {
    e.stopPropagation();

    const { api, attributeId, removeAttributeData, toggleAttributeSelected } = this.props;

    /**
     * products.filter(product =>
     product.items.some(item => item.name === 'milk');
     ).map(product =>
     product.id
     )
     */

    let themeId = -1;
    let subthemeId = -1;

    for (let theme of api.themes) {
      for (let subtheme of theme.subthemes) {
        if (subtheme.attributes.find((attr) => attr.id === attributeId)) {
          themeId = theme.id;
          subthemeId = subtheme.id;

          break;
        }
      }
    }

    removeAttributeData(attributeId);
    toggleAttributeSelected(themeId, subthemeId, attributeId);
  };

  render() {
    const { classes, attributeName, value } = this.props;

    return (
      <Tab
        classes={{ label: classes.label, labelContainer: classes.labelContainer, }}
        component="div"
        value={value}
        onClick={this.handleClick}
        label={
          <React.Fragment>
            {attributeName}
            <IconButton color="secondary" onClick={this.handleCloseClick}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    )
  }
}

const mapStateToProps = (state) => ({
  api: state.api,
});

const mapDispatchToProps = (dispatch) => ({
  removeAttributeData: (attributeId) => dispatch(removeAttributeData(attributeId)),
  toggleAttributeSelected: (themeId, subthemeId, attributeName) => dispatch(toggleAttributeSelected(themeId, subthemeId, attributeName)),
});

TabHeader = withStyles(styles)(TabHeader);
TabHeader = connect(mapStateToProps, mapDispatchToProps)(TabHeader);

export default TabHeader
