import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import getContractInstance from "./utils/getContractInstance";
import enigmaContractDefinition from "./contracts/Enigma.json";
import enigmaTokenContractDefinition from "./contracts/EnigmaToken.json";
import millionairesProblemFactoryContractDefinition from "./contracts/MillionairesProblemFactory.json";
import millionairesProblemContractDefinition from "./contracts/MillionairesProblem.json";
import { Switch, Route, NavLink, BrowserRouter } from "react-router-dom";
import { Container, Message } from "semantic-ui-react";
import Header from "./Header";
import Home from "./Home";
import SimpleModalWrapped from "./SimpleModalWrapped";
import MillionairesProblemWrapper from "./MillionairesProblemWrapper";
import Paper from "@material-ui/core/Paper";
import "./App.css";

const testUtils = require("./test/test-utils");
const eng = require("./lib/Enigma");
const GAS = "1000000";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      Enigma: null,
      EnigmaToken: null,
      MillionairesProblemFactory: null,
      MillionairesProblem: null,
      enigma: null,
      principal: null,
      message: ""
    };
    this.setMessage = this.setMessage.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the deployed instances

      const Enigma = await getContractInstance(web3, enigmaContractDefinition);
      const EnigmaToken = await getContractInstance(
        web3,
        enigmaTokenContractDefinition
      );
      const MillionairesProblemFactory = await getContractInstance(
        web3,
        millionairesProblemFactoryContractDefinition
      );
      const millionairesProblems = await MillionairesProblemFactory.methods
        .getMillionairesProblems()
        .call();
      if (millionairesProblems.length != 0) {
        const MillionairesProblem = await getContractInstance(
          web3,
          millionairesProblemContractDefinition,
          millionairesProblems[millionairesProblems.length - 1]
        );
        this.setState({
          MillionairesProblem
        });
      }

      const enigma = new eng.Enigma(Enigma, EnigmaToken);
      const principal = new testUtils.Principal(Enigma, accounts[9]);
      const resultRegister = await principal.register();
      const eventRegister = resultRegister.events.Register.returnValues;
      if (!eventRegister._success) {
        throw "Unable to register worker";
      }
      const resultWP = await principal.setWorkersParams();
      const eventWP = resultWP.events.WorkersParameterized.returnValues;
      if (!eventWP._success) {
        throw "Unable to set worker params";
      }
      console.log("network using random seed:", eventWP.seed);

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        Enigma,
        EnigmaToken,
        MillionairesProblemFactory,
        enigma,
        principal
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      console.log(error);
    }
  };

  setMessage(message) {
    this.setState({ message });
  }

  async createNewMillionairesProblem() {
    this.setState({ message: "Creating new millionaires' problem" });
    await this.state.MillionairesProblemFactory.methods
      .createNewMillionairesProblem()
      .send({
        from: this.state.accounts[0],
        gas: GAS
      });

    const millionairesProblems = await this.state.MillionairesProblemFactory.methods
      .getMillionairesProblems()
      .call();
    const MillionairesProblem = await getContractInstance(
      this.state.web3,
      millionairesProblemContractDefinition,
      millionairesProblems[millionairesProblems.length - 1]
    );
    this.setState({
      MillionairesProblem,
      message: ""
    });
  }

  render() {
    if (!this.state.web3) {
      return (
        <div className="App">
          <Header web3={this.state.web3} accounts={[]} />
          <Message color="red">No web3</Message>
        </div>
      );
      return <div>Loading Web3, accounts, and contract...</div>;
    } else if (this.state.accounts.length < 1) {
      return (
        <div className="App">
          <Header web3={this.state.web3} accounts={this.state.accounts} />
          <Message color="red">No accounts in place...</Message>
        </div>
      );
    } else if (this.state.MillionairesProblem == null) {
      return (
        <div className="App">
          <Header
            web3={this.state.web3}
            accounts={this.state.accounts}
            onCreateNewMillionaresProblem={() => {
              this.createNewMillionairesProblem();
            }}
          />
          <Message color="red">
            Please create a new Millionaires' Problem
          </Message>
        </div>
      );
    } else {
      return (
        <div className="App">
          <Header
            web3={this.state.web3}
            accounts={this.state.accounts}
            onCreateNewMillionaresProblem={() => {
              this.createNewMillionairesProblem();
            }}
          />
          <br />
          <Container>
            <Paper>
              <MillionairesProblemWrapper
                accounts={this.state.accounts}
                web3={this.state.web3}
                enigma={this.state.enigma}
                MillionairesProblem={this.state.MillionairesProblem}
                onSetMessage={this.setMessage}
              />
              <SimpleModalWrapped message={this.state.message} />
            </Paper>
          </Container>
        </div>
      );
    }
  }
}

export default App;
