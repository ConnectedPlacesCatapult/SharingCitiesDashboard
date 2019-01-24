import React from 'react';
import PropTypes from 'prop-types';

import PlotLayer from './PlotLayer';
import LayerDialog from './dialogs/LayerDialog';
import FieldValuePair from './FieldValuePair';

// redux
import { connect } from 'react-redux';
import {
  setPlotProperty,
  addPlotLayer,
} from "../../actions/plotActions";

// material-ui
import { withStyles } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";

// material-ui lab
//import Slider from '@material-ui/lab/Slider';

// vega
import VegaLite from 'react-vega-lite';

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing.unit * 2,
    //backgroundColor: theme.palette.primary.dark,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    margin: theme.spacing.unit,
  },
  layers: {
    display: 'flex',
    flexDirection: 'row',
  },

  modal: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
});

class PlotPage extends React.Component {
  state = {
    addLayerModalOpen: false,
    layerDialogOpen: false,
  };

  setSpecProperty = (name) => e => {
    this.props.setPlotProperty(name, e.target.value)
  };

  addPlotLayer = (mark, encoding) => e => {
    this.props.addPlotLayer(mark, encoding)
  };

  getMenuItems = (arr) => {
    return arr.map((val, i) => {
      return <MenuItem key={i} value={val}>{val}</MenuItem>
    })
  };


  handleAddLayerClick = () => {
    console.log("open");

    this.setState({ addLayerModalOpen: true })
  };

  handleModalClose = () => {

    console.log("close");

    this.setState({ addLayerModalOpen: false })
  };


  handleClickOpen = () => {
    this.setState({ layerDialogOpen: true })
  };

  handleLayerDialogClose = () => {
    this.setState({ layerDialogOpen: false })
  };

  render() {
    const { classes, config, plot } = this.props;

    const plotLayers = plot.spec.layer.map((layer, layerIndex) => {
      return (
        <PlotLayer
          key={layerIndex}
          layerIndex={layerIndex}
          layer={layer}
          getMenuItems={this.getMenuItems}
        />
      )
    });

    return (
      <div className={classes.root}>
        <form className={classes.form}>

          <FormControl className={classes.formControl}>
            <FormLabel className={classes.formLabel}>Details</FormLabel>
            <TextField
              label="Title"
              className={classes.textField}
              value={plot.spec.title}
              onChange={this.setSpecProperty('title')}
              margin="normal"
            />
            <TextField
              label="Name"
              className={classes.textField}
              value={plot.spec.name}
              onChange={this.setSpecProperty('name')}
              margin="normal"
            />
            <TextField
              label="Description"
              className={classes.textField}
              value={plot.spec.description}
              onChange={this.setSpecProperty('description')}
              margin="normal"
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <FormLabel className={classes.formLabel}>Dimensions</FormLabel>
            <TextField
              label="Width"
              className={classes.textField}
              value={plot.spec.width}
              onChange={this.setSpecProperty('width')}
              margin="normal"
            />
            <TextField
              label="Height"
              className={classes.textField}
              value={plot.spec.height}
              onChange={this.setSpecProperty('height')}
              margin="normal"
            />
          </FormControl>

          <FormControl className={classes.formControl}>
            <FormLabel className={classes.formLabel}>Layers</FormLabel>
            <Button
              variant="contained"
              className={classes.button}
              onClick={this.addPlotLayer("bar", {})}
            >
              Add layer
            </Button>

            <Button
              variant="contained"
              className={classes.button}
              onClick={this.handleClickOpen}
            >
              Add Layer (dialog)
            </Button>

            <LayerDialog
              open={this.state.layerDialogOpen}
              onClose={this.handleLayerDialogClose}
              getMenuItems={this.getMenuItems}
              plotTypes={config.vega.plotTypes}
            />


            {/*<Dialog
              open={this.state.addLayerModalOpen}
              onClose={this.handleModalClose}
              //className={classes.modal}
            >
              <DialogTitle>Add new layer</DialogTitle>
              <div>
                <form>
                  <FormControl>
                    <InputLabel htmlFor="plot-layer-mark">Mark</InputLabel>
                    <Select
                      value={"point"}
                    >
                      {this.getMenuItems(config.vega.plotTypes)}
                    </Select>
                  </FormControl>
                </form>
              </div>

            </Dialog>*/}

            <div className={classes.layers}>
              {plotLayers}
            </div>
          </FormControl>

        </form>
        <VegaLite spec={plot.spec} data={plot.data} />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  config: state.config.config,
  plot: state.plot,
});

const mapDispatchToProps = (dispatch) => ({
  setPlotProperty: (name, value) => dispatch(setPlotProperty(name, value)),
  addPlotLayer: (mark, encoding) => dispatch(addPlotLayer(mark, encoding)),
});

PlotPage.propTypes = {
  classes: PropTypes.object.isRequired,
  config: PropTypes.object.isRequired,
  plot: PropTypes.object.isRequired,
  setPlotProperty: PropTypes.func.isRequired,
  addPlotLayer: PropTypes.func.isRequired,
};

PlotPage = withStyles(styles)(PlotPage);
PlotPage = connect(mapStateToProps, mapDispatchToProps)(PlotPage);

export default PlotPage
