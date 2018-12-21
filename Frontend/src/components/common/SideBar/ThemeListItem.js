import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DatabaseIcon from 'mdi-material-ui/Database';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import greyColor from '@material-ui/core/colors/grey';

import SubThemeList from './SubthemeList';

const styles = theme => ({
  listItemText: {
    color: greyColor[800],
  },
});

class ThemeListItem extends React.Component {
  render() {
    const { classes, themeId, themeName, isSelected, onClick } = this.props;

    return (
      <React.Fragment>
        <ListItem button onClick={onClick}>
          {
            isSelected
              ? <ExpandMore color="secondary" />
              : <ChevronRight color="secondary"/>
          }
          <ListItemText inset className={classes.listItemText}>
            {themeName}
          </ListItemText>
          <ListItemIcon>
            <DatabaseIcon/>
          </ListItemIcon>
        </ListItem>
        <Collapse in={isSelected} timeout="auto" unmountOnExit>
          <SubThemeList themeId={themeId} />
        </Collapse>
      </React.Fragment>
    )
  }
}

ThemeListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  themeId: PropTypes.number.isRequired,
  themeName: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(ThemeListItem)
