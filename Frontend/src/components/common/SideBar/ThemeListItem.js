import React from 'react';
import PropTypes from 'prop-types';

import SubThemeList from './SubthemeList';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DatabaseIcon from 'mdi-material-ui/Database';
import TransportIcon from 'mdi-material-ui/Bus';
import EnvironmentIcon from 'mdi-material-ui/Tree';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import greyColor from '@material-ui/core/colors/grey';

const styles = (theme) => ({
  listItemText: {
    // color: greyColor[800],
    color: theme.palette.tertiary.main,
    fontWeight: 'bold'
  },
});

class ThemeListItem extends React.Component {

  getIcon(themeName) {
    if (themeName === 'Transport') {
      return <TransportIcon color="primary"/>
    } else if (themeName === 'Environment') {
      return <EnvironmentIcon color="primary"/>
    } else {
      return <DatabaseIcon color="primary"/>
    }
  }

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
          <ListItemText
            disableTypography
            primary={<Typography variant="subtitle1" color="primary" className={classes.listItemText}>{themeName}</Typography>}
          />
          <ListItemIcon>
            {this.getIcon(themeName)}
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

ThemeListItem = withStyles(styles)(ThemeListItem);

export default ThemeListItem
