import React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Tabs,
  withStyles,
  Paper
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

    const tabs = api.data.map((attr, i) => <TabHeader key={i} value={i} onChange={this.handleChange} attributeId={attr["Attribute_id"]} attributeName={attr["Attribute_Name"]} />);
    const contents = api.data.map((attr, i) => <TabContent key={i} isActive={activeTab === i} {...attr} />);

    return (
      <Paper className={classes.root}>
        <AppBar position="static" elevation={0}>
          <Tabs
            value={activeTab}
            onChange={this.handleChange}
            variant="scrollable"
          >
            {tabs}
          </Tabs>
        </AppBar>
        {contents}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => ({
  api: state.api,
});

AttributeTabs = withStyles(styles)(AttributeTabs);
AttributeTabs = connect(mapStateToProps, {})(AttributeTabs);

export default AttributeTabs
