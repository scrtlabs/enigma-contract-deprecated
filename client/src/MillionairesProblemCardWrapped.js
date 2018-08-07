import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import millionairesProblemContractDefinition from "./contracts/MillionairesProblem.json";
import getContractInstance from "./utils/getContractInstance";
const engUtils = require("./lib/enigma-utils");

const styles = {
  card: {
    minWidth: 275
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
};

class MillionairesProblemCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      MillionairesProblem: null,
      millionaireAName: null,
      millionaireBName: null,
      millionaireANetWorth: null,
      millionaireBNetWorth: null,
      ready: false,
      winner: null
    };
  }

  async componentDidMount() {
    const MillionairesProblem = await getContractInstance(
      this.props.web3,
      millionairesProblemContractDefinition,
      this.props.address
    );
    this.setState({ MillionairesProblem });
    const millionairesInfo = await MillionairesProblem.getMillionaires.call();
    const millionairesNames = millionairesInfo[0];
    const millionairesNetWorths = millionairesInfo[1];
    const numMillionaires = await MillionairesProblem.numMillionaires.call();
    if (numMillionaires.toNumber() == 2) {
      this.setState({
        millionaireAName: millionairesNames[0],
        millionaireBName: millionairesNames[1],
        ready: true
      });
    } else if (numMillionaires.toNumber() == 1) {
      this.setState({ millionaireAName: millionairesNames[0] });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="headline" component="h2">
              {this.props.address}
            </Typography>
            <Typography component="p">
              User A: {this.state.millionaireAName} ({
                this.state.millionaireANetWorth
              })
              <br />
              User B: {this.state.millionaireBName} ({
                this.state.millionaireBNetWorth
              })
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Enter Net Worth</Button>
          </CardActions>
        </Card>
      </div>
    );
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

MillionairesProblemCard.propTypes = {
  classes: PropTypes.object.isRequired
};

const MillionairesProblemCardWrapped = withStyles(styles)(
  MillionairesProblemCard
);
export default MillionairesProblemCardWrapped;
