import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
const engUtils = require("./lib/enigma-utils");

const CALLABLE = "computeRichest(bytes32[2],uint[2])";
const CALLBACK = "setRichestName(bytes32)";
const ENG_FEE = 1;
const GAS = 4712388;

class FormDialog extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false, name: null, netWorth: null };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCheckRichest = this.handleCheckRichest.bind(this);
    this.enigmaTask = this.enigmaTask.bind(this);
  }

  handleClickOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false, name: null, netWorth: null });
  }

  async handleSubmit() {
    this.props.onSetMessage("Stating net worth...please wait 15-20 seconds");
    console.log(this.state.netWorth);
    const encryptedNetWorth = getEncryptedNetWorth(
      parseInt(this.state.netWorth)
    );
    console.log(encryptedNetWorth);
    await this.props.MillionairesProblem.stateNetWorth(
      this.state.name,
      encryptedNetWorth,
      { from: this.props.accounts[0], gas: "1000000" }
    );
    this.props.onSetMillionaire(this.state.name);
    this.setState({
      open: false,
      name: null,
      netWorth: null
    });
  }

  /*
   * Creates an Enigma task to be computed by the network.
   */
  async enigmaTask() {
    let millionaires = await this.props.MillionairesProblem.getMillionaires.call();
    console.log(millionaires);
    console.log(millionaires[0]);
    let blockNumber = await this.props.web3.eth.getBlockNumber();
    let task = await this.props.enigma.createTask(
      blockNumber,
      this.props.MillionairesProblem.address,
      CALLABLE,
      [millionaires[0], millionaires[1]],
      CALLBACK,
      ENG_FEE,
      []
    );
    let resultFee = await task.approveFee({
      from: this.props.accounts[0],
      gas: "1000000"
    });
    let result = await task.compute({
      from: this.props.accounts[0],
      gas: "1000000"
    });
    console.log("got tx:", result.tx, "for task:", task.taskId, "");
    console.log("mined on block:", result.receipt.blockNumber);
  }

  handleCheckRichest() {
    this.props.onSetMessage(
      "Computing richest millionaire...please wait 15-20 seconds"
    );
    this.enigmaTask();
    this.props.onSetMessage("");
    this.props.onGetRichestName();
  }

  setName = event => {
    this.setState({ name: event.target.value });
  };

  setEncryptedNetWorth = event => {
    this.setState({ netWorth: event.target.value });
  };

  render() {
    if (this.props.numMillionaires < 2) {
      return (
        <div>
          <Button onClick={this.handleClickOpen}>
            Add Millionaire Name and Net Worth
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Submit</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your name and net worth (will be sent in encrypted
                fashion)!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                onChange={this.setName}
              />
              <TextField
                autoFocus
                margin="dense"
                id="netWorth"
                label="Net Worth"
                type="text"
                onChange={this.setEncryptedNetWorth}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={this.handleSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      );
    } else {
      return (
        <div>
          <Button onClick={this.handleCheckRichest}>Check Richest</Button>
        </div>
      );
    }
  }
}

function getEncryptedNetWorth(netWorth) {
  let clientPrivKey =
    "853ee410aa4e7840ca8948b8a2f67e9a1c2f4988ff5f4ec7794edf57be421ae5";
  let enclavePubKey =
    "0061d93b5412c0c99c3c7867db13c4e13e51292bd52565d002ecf845bb0cfd8adfa5459173364ea8aff3fe24054cca88581f6c3c5e928097b9d4d47fce12ae47";
  let derivedKey = engUtils.getDerivedKey(enclavePubKey, clientPrivKey);
  let encrypted = engUtils.encryptMessage(derivedKey, netWorth);

  return encrypted;
}

export default FormDialog;
