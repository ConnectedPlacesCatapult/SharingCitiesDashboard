import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DatabaseIcon from 'mdi-material-ui/Database';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
import greyColor from '@material-ui/core/colors/grey';

// redux stuff
import { connect } from 'react-redux';
import { setCurrentDatasource } from './../../actions/datasourceActions';
import { addTheme } from "../../actions/themeActions";

// fake data
import THEME_DATA from "./../../data/dataThemes";

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    backgroundColor: theme.palette.primary.main,
  },
  appBarSpacer: theme.mixins.toolbar,
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
});

class SideBar extends Component {
  render() {
    const { classes } = this.props;

    return (
      <Drawer
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
        variant="permanent"
      >
        <div className={classes.appBarSpacer} />
        <div className={classes.appBarSpacer} />
        <ThemeList />
      </Drawer>
    )
  }
}

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SideBar);

class ThemeList extends Component {
  render() {
    const themeListItems = THEME_DATA.map((theme, i) => {
      this.props.addTheme(theme.name);

      return <ThemeListItem key={i} {...theme} />
    });

    return (
      <List component="nav">
        {themeListItems}
      </List>
    )
  }
}

ThemeList = connect(null, { addTheme })(ThemeList);

const themeListItemStyles = theme => ({
  listItemText: {
    color: greyColor[800],
  },
});

class ThemeListItem extends Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { classes } = this.props;

    const sources = this.props.sources.map((source, i) => {
      return (
        <SourceListItem key={i} {...source} />
      )
    });

    return (
      <div>
        <ListItem button onClick={this.handleClick}>
          {
            this.state.open
              ? <ExpandMore color="secondary" />
              : <ChevronRight color="secondary"/>
          }
          <ListItemText inset className={classes.listItemText}>
            {this.props.name}
          </ListItemText>
          <ListItemIcon>
            <DatabaseIcon/>
          </ListItemIcon>
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

ThemeListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

ThemeListItem = withStyles(themeListItemStyles)(ThemeListItem);

const sourceListItemStyles = theme => ({
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
  };

  render() {
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

function mapStateToProps(state) {
  return {
    datasource: state.datasource,
  };
}

SourceListItem = connect(mapStateToProps, { setCurrentDatasource })(withStyles(sourceListItemStyles)(SourceListItem));
