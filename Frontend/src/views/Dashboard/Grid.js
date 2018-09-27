import React, { Component } from 'react';
import GridLayout from 'react-grid-layout';
//import Widget from './Widget';

import './Grid.css';

// temp widget imports
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { lighten } from "../../../node_modules/@material-ui/core/styles/colorManipulator";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import OpenWithIcon from '@material-ui/icons/OpenWith';
import IconButton from '@material-ui/core/IconButton';
import Widgets from './Widgets';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import SettingsIcon from "@material-ui/icons/Settings";


class Grid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      layoutData: props.layoutData,
      widgets: []
    };
  }

  handleLayoutChange = (layout) => {
    this.setState({ layout: layout });
  };

  componentWillMount() {
    let widgets = [];

    this.state.layoutData.forEach((row, i) => {
      widgets[i] = {
        i: i,
        component: row.component,
        name: row.name,
        grid: row.grid,
        options: row.options || {},
        data: row.data || {}
      };
    });

    this.setState({ widgets: widgets });
  }

  handleDeleteWidget = key => {
    this.setState({ widgets: this.state.widgets.filter((widget) => {
        return widget.i !== key;
      })});
  };

  render() {
    const { classes } = this.props;

    /*const widgets = this.state.widgets.map((widget, i) => {
      return <Widget key={i} data-grid={widget.grid} {...widget} onDelete={key => this.handleDeleteWidget(key)} />
    });*/

    // ToDo: this needs to be a component with a state etc. to handle delete/settings buttons etc.
    const widgets2 = this.state.widgets.map((widget, i) => {
      //const WidgetComponent = this.getWidgetComponent(widget);
      const WidgetComponent = Widgets[widget.component];
      const handleCloseDeleteDialog = () => {

      };
      const deleteWidget = () => {

      };

      return (
      <Card key={i} data-grid={widget.grid} className={' widget ' + classes.card}>
        <CardHeader
        className={classes.header}
        title={widget.name}
        />
        <CardContent>
          <WidgetComponent />
        </CardContent>
        <CardActions className={classes.actions}>
          <IconButton color="primary">
            <DeleteIcon />
          </IconButton>
          <IconButton color="secondary">
            <SettingsIcon />
          </IconButton>
          <IconButton color="inherit" size="small">
            <OpenWithIcon
            className="react-grid-item-drag-handle"
            />
          </IconButton>
          <DeleteDialog open={false} handleClickNo={handleCloseDeleteDialog} handleClickYes={deleteWidget} />
        </CardActions>
      </Card>
      )
    });

    return (
    <GridLayout
    className="grid layout"
    cols={12}
    rowHeight={100}
    width={1200}
    containerPadding={[0, 0]}
    onLayoutChange={layout => this.handleLayoutChange(layout)}
    >
      {/*{widgets}*/}
      {widgets2}
    </GridLayout>
    )
  }
}

//export default Grid;





// temp widget stuff below here

const widgetStyles = theme => ({
  card: {
    minWidth: 275,
  },
  header: {
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderBottom: '1px solid ' + theme.palette.primary.main,
  },
  actions: {
    display: 'flex',
    backgroundColor: lighten(theme.palette.primary.light, 0.6),
    borderTop: '1px solid ' + theme.palette.primary.main,
    paddingBottom: '29px',
  },
});

Grid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(widgetStyles)(Grid);

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class DeleteDialog extends Component {
  render() {
    const { open, handleClickNo, handleClickYes } = this.props;

    return (
    <Dialog
    open={open}
    TransitionComponent={Transition}
    keepMounted
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete this Widget?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deleting this Widget is permanent
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClickNo} color="primary">
          Disagree
        </Button>
        <Button onClick={handleClickYes} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
    )
  }
}