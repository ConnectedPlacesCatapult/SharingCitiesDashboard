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
  setActiveTabAttribute,
  toggleAttributeSelected,
} from "../../../actions/dataTableActions";

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
    attributeTable: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    setActiveTabAttribute: PropTypes.func.isRequired,
    toggleAttributeSelected: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { value, attributeId, attributeName, attributeTable, onChange, setActiveTabAttribute } = this.props;

    onChange(value);
    setActiveTabAttribute(attributeId, attributeName, attributeTable)
  };

  handleCloseClick = (e) => {
    e.stopPropagation();

    const { dataTable, attributeId, removeAttributeData, toggleAttributeSelected } = this.props;

    let themeId = -1;
    let subthemeId = -1;

    for (let theme of dataTable.themes) {
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
  dataTable: state.dataTable,
});

const mapDispatchToProps = (dispatch) => ({
  removeAttributeData: (attributeId) => dispatch(removeAttributeData(attributeId)),
  setActiveTabAttribute: (id, name, table) => dispatch(setActiveTabAttribute(id, name, table)),
  toggleAttributeSelected: (themeId, subthemeId, attributeName) => dispatch(toggleAttributeSelected(themeId, subthemeId, attributeName)),
});

TabHeader = withStyles(styles)(TabHeader);
TabHeader = connect(mapStateToProps, mapDispatchToProps)(TabHeader);

export default TabHeader
