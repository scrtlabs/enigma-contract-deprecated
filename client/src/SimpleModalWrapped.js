import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const modalStyles = theme => ({
  paper: {
    position: "absolute",
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
});

class SimpleModal extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, message: "" };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.message != nextProps.message) {
      nextProps.message == ""
        ? this.setState({
            open: false,
            message: nextProps.message
          })
        : this.setState({
            open: true,
            message: nextProps.message
          });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="title" id="modal-title">
              {this.state.message}
            </Typography>
            <LinearProgress />
          </div>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
const SimpleModalWrapped = withStyles(modalStyles)(SimpleModal);

export default SimpleModalWrapped;
