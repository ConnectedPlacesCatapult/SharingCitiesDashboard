import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Tab,
  Tabs,
  withStyles,
} from '@material-ui/core';
import { connect } from 'react-redux';
import TabContent from './TabContent';

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  label: {
    fontSize: '0.875rem',
  },
});

class AttributeTabs extends React.Component {
  state = {
    activeTab: 0,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  // catch situation where the active tab's attribute has been deselected from the sde panel
  static getDerivedStateFromProps(props, state) {
    if (state.activeTab >= props.api.data.length) {
      state.activeTab = props.api.data.length - 1
    }

    return state;
  }

  handleChange = (e, value) => {
    this.setState({ activeTab: value })
  };

  render() {
    const { classes, api } = this.props;
    const { activeTab } = this.state;

    const tabs = api.data.map((attr, i) => <Tab classes={{ label: classes.label }} key={i} label={attr['Attribute_Name']} />);
    const contents = api.data.map((attr, i) => <TabContent key={i} isActive={activeTab === i} {...attr} />);

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
  api: state.api,
});

AttributeTabs = withStyles(styles)(AttributeTabs);
AttributeTabs = connect(mapStateToProps, {})(AttributeTabs);

export default AttributeTabs
