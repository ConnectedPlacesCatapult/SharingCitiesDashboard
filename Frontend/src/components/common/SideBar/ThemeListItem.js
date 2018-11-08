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
import { connect } from 'react-redux';
import { toggleSourceSelected } from "./../../../actions/sourcesActions";
import { fetchData, purgeData } from "./../../../actions/dataActions";
import _ from 'lodash';

import SourceListItem from './SourceListItem';

const styles = theme => ({
  listItemText: {
    color: greyColor[800],
  },
});

class ThemeListItem extends Component {
  handleSourceClicked = (id, isSelected, source) => {
    if (isSelected) {
      this.props.purgeData()
    } else {
      this.props.fetchData({
        source: source.name,
        theme: this.props.themeName,
        meta: source.meta,
      })
    }

    this.props.toggleSourceSelected(id);
  };

  isSourceSelected = (id) => {
    return _.indexOf(this.props.selectedSources, id) !== -1
  };

  render() {
    const { classes, themeId, themeName, sources, isSelected, onClick } = this.props;

    const sourceListItems = sources.map((source, i) => {
      const sourceId = themeId + "_" + i;
      const selected = this.isSourceSelected(sourceId);

      return (
        <SourceListItem
          key={i}
          isSelected={selected}
          onClick={() => this.handleSourceClicked(sourceId, selected, source)}
          {...source}
        />
      )
    });

    return (
      <div>
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
  themeId: PropTypes.number.isRequired,
  themeName: PropTypes.string.isRequired,
  sources: PropTypes.array.isRequired,
  selectedSources: PropTypes.array.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  toggleSourceSelected: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  purgeData: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  selectedSources: state.sources.selected,
});

const mapDispatchToProps = dispatch => ({
  toggleSourceSelected: id => dispatch(toggleSourceSelected(id)),
  fetchData: requestObj => dispatch(fetchData(requestObj)),
  purgeData: () => dispatch(purgeData()),
});

ThemeListItem = withStyles(styles)(ThemeListItem);
export default connect(mapStateToProps, mapDispatchToProps)(ThemeListItem)
