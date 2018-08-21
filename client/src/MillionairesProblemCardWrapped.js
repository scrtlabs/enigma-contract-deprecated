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

MillionairesProblemCard.propTypes = {
  classes: PropTypes.object.isRequired
};

const MillionairesProblemCardWrapped = withStyles(styles)(
  MillionairesProblemCard
);
export default MillionairesProblemCardWrapped;
