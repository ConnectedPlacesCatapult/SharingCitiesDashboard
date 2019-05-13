import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Tabs,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import TabHeader from './TabHeader';
import TabContent from './TabContent';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
});

class AttributeTabs extends React.Component {
  state = {
    activeTab: 0,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  // catch situation where the active tab's attribute has been deselected from the side panel
  static getDerivedStateFromProps(props, state) {
    if (state.activeTab >= props.dataTable.data.length) {
      state.activeTab = props.dataTable.data.length - 1
    }

    return state;
  }

  handleChange = (value) => {
    this.setState({ activeTab: value })
  };

  render() {
    const { classes, dataTable } = this.props;
    const { activeTab } = this.state;

    const tabs = dataTable.data.map((attr, i) => {
      return (
        <TabHeader
          key={i}
          value={i}
          onChange={this.handleChange}
          attributeId={attr["Attribute_id"]}
          attributeName={attr["Attribute_Name"]}
          attributeTable={attr["Attribute_Table"]}
        />
      )
    });
    const contents = dataTable.data.map((attr, i) => <TabContent key={i} isActive={activeTab === i} {...attr} />);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs
            value={activeTab}
            onChange={this.handleChange}
            variant="scrollable"
          >
            {tabs}
          </Tabs>
        </AppBar>
        {contents}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  dataTable: state.dataTable,
});

AttributeTabs = withStyles(styles)(AttributeTabs);
AttributeTabs = connect(mapStateToProps, null)(AttributeTabs);

export default AttributeTabs
