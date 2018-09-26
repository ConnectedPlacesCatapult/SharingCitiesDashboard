import React, { Component } from 'react';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DatabaseIcon from 'mdi-material-ui/Database';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import TableIcon from "mdi-material-ui/Table";

class DataSourceList extends Component {
  render() {
    const { themes, activeDataSource, onDataSourceSelected, openDrawer } = this.props;

    const themeListItems = themes.map((theme, i) => {
      return <ThemeListItem key={i} activeDataSource={activeDataSource} onDataSourceSelected={onDataSourceSelected} openDrawer={openDrawer} {...theme} />
    });

    return (
      <List component="nav">
        {themeListItems}
      </List>
    )
  }
}

export default DataSourceList;

class ThemeListItem extends Component {
  state = {
    open: !this.props.collapsed
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }), () => {
      this.props.openDrawer();
    });
  };

  render() {
    const { activeDataSource, onDataSourceSelected, openDrawer } = this.props;

    const sources = this.props.sources.map((source, i) => {
      return (
        <SourceListItem key={i} activeDataSource={activeDataSource} onDataSourceSelected={onDataSourceSelected} openDrawer={openDrawer} {...source} />
      )
    });

    return (
      <div>
        <ListItem button divider onClick={this.handleClick}>
          <ListItemIcon>
            <DatabaseIcon/>
          </ListItemIcon>
          <ListItemText inset primary={this.props.name}/>
          {this.state.open ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {sources}
          </List>
        </Collapse>
      </div>
    )
  }
}

const sourceListItemStyles = theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  }
});

class SourceListItem extends Component {
  state = {
    active: this.props.name === this.props.activeDataSource
  };

  handleClick = () => {
    this.setState(state => ({ active: !state.active }), () => {
      this.props.onDataSourceSelected(this.props.name);
      this.props.openDrawer();
    });
  };

  render() {
    const { classes, name } = this.props;

    return (
      <div>
        <ListItem button className={classes.nested} onClick={this.handleClick}>
          <ListItemIcon>
            <TableIcon />
          </ListItemIcon>
          <ListItemText inset primary={name} />
        </ListItem>
      </div>
    )
  }
}

SourceListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

SourceListItem = withStyles(sourceListItemStyles)(SourceListItem);