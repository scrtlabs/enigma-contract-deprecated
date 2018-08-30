import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AddMillionaireDialog from "./AddMillionaireDialog";
const engUtils = require("./lib/enigma-utils");
const CALLABLE = "computeRichest(address[],uint[])";
const CALLBACK = "setRichestAddress(address)";
const ENG_FEE = 1;
const GAS = 4712388;

const styles = theme => ({
	button: {
		display: "block",
		marginTop: theme.spacing.unit * 2
	},
	formControl: {
		margin: theme.spacing.unit,
		minWidth: 120
	}
});

class MillionairesProblemWrapper extends Component {
	constructor(props) {
		super(props);
		this.state = {
			numMillionaires: 0,
			richestAddress: "TBD"
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.addMillionaire = this.addMillionaire.bind(this);
	}

	componentDidMount = async () => {
		let numMillionaires = await this.props.MillionairesProblem.methods
			.numMillionaires()
			.call();
		this.setState({ numMillionaires });
	};

	async componentWillReceiveProps(nextProps) {
		if (this.props.MillionairesProblem != nextProps.MillionairesProblem) {
			this.setState({ numMillionaires: 0, richestAddress: "TBD" });
		}
	}

	async addMillionaire(address, netWorth) {
		let encryptedAddress = getEncryptedValue(this.props.web3, address);
		let encryptedNetWorth = getEncryptedValue(this.props.web3, netWorth);
		console.log(encryptedAddress);
		await this.props.MillionairesProblem.methods
			.addMillionaire(encryptedAddress, encryptedNetWorth)
			.send({ from: this.props.accounts[0], gas: "1000000" });
		let numMillionaires = await this.props.MillionairesProblem.methods
			.numMillionaires()
			.call();
		this.setState({ numMillionaires });
	}

	/*
   * Creates an Enigma task to be computed by the network.
   */
	async enigmaTask() {
		let numMillionaires = await this.props.MillionairesProblem.methods
			.numMillionaires()
			.call();
		let encryptedAddresses = [];
		let encryptedNetWorths = [];
		for (let i = 0; i < numMillionaires; i++) {
			let encryptedValue = await this.props.MillionairesProblem.methods
				.getInfoForMillionaire(i)
				.call();
			encryptedAddresses.push(encryptedValue[0]);
			encryptedNetWorths.push(encryptedValue[1]);
		}
		let blockNumber = await this.props.web3.eth.getBlockNumber();
		let task = await this.props.enigma.createTask(
			blockNumber,
			this.props.MillionairesProblem.options.address,
			CALLABLE,
			[encryptedAddresses, encryptedNetWorths],
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
		let resultReceipt = result.events.ComputeTask;
		console.log(
			"got tx:",
			resultReceipt.transactionHash,
			"for task:",
			resultReceipt.returnValues.taskId,
			""
		);
		console.log("mined on block:", resultReceipt.returnValues.blockNumber);
	}

	async handleSubmit(event) {
		event.preventDefault();
		let richestAddress = "Computing richest...";
		this.setState({ richestAddress });
		await this.enigmaTask();
		this.props.MillionairesProblem.events
			.CallbackFinished()
			.on("data", async event => {
				richestAddress = await this.props.MillionairesProblem.methods
					.richestMillionaire()
					.call();
				this.setState({ richestAddress });
			})
			.on("error", console.error);
	}

	render() {
		const { classes } = this.props;
		return (
			<div>
				<h2>Num Millionaires = {this.state.numMillionaires}</h2>
				<h2>Richest Millionaire = {this.state.richestAddress}</h2>
				<AddMillionaireDialog
					accounts={this.props.accounts}
					onAddMillionaire={this.addMillionaire}
				/>
				<br />
				<Button
					onClick={this.handleSubmit}
					disabled={this.state.numMillionaires == 0}
					variant="contained"
					color="secondary"
				>
					Check Richest
				</Button>
			</div>
		);
	}
}

function getEncryptedValue(web3, value) {
	let clientPrivKey =
		"853ee410aa4e7840ca8948b8a2f67e9a1c2f4988ff5f4ec7794edf57be421ae5";
	let enclavePubKey =
		"0061d93b5412c0c99c3c7867db13c4e13e51292bd52565d002ecf845bb0cfd8adfa5459173364ea8aff3fe24054cca88581f6c3c5e928097b9d4d47fce12ae47";
	let derivedKey = engUtils.getDerivedKey(enclavePubKey, clientPrivKey);
	let encrypted = engUtils.encryptMessage(derivedKey, value);

	return web3.utils.asciiToHex(encrypted);
}

MillionairesProblemWrapper.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(MillionairesProblemWrapper);
