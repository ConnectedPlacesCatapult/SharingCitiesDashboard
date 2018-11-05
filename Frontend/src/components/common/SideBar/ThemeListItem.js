import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DatabaseIcon from 'mdi-material-ui/Database';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import greyColor from '@material-ui/core/colors/grey';

import SourceListItem from './SourceListItem';

const styles = theme => ({
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
    const { classes, sources } = this.props;

    const sourceListItems = sources.map((source, i) => {
      return <SourceListItem key={i} {...source} />
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
            {sourceListItems}
          </List>
        </Collapse>
      </div>
    )
  }
}

ThemeListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  sources: PropTypes.array.isRequired,
};

export default withStyles(styles)(ThemeListItem);
