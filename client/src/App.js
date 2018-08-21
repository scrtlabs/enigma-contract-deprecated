import React, { Component } from "react";
import getWeb3 from "./utils/getWeb3";
import getAccounts from "./utils/getAccounts";
import getContractInstance from "./utils/getContractInstance";
import enigmaContractDefinition from "./contracts/Enigma.json";
import enigmaTokenContractDefinition from "./contracts/EnigmaToken.json";
import millionairesProblemFactoryContract from "./contracts/MillionairesProblemFactory.json";
import millionairesProblemContract from "./contracts/MillionairesProblem.json";
import { Switch, Route, NavLink, BrowserRouter } from "react-router-dom";
import { Container, Message } from "semantic-ui-react";
import Header from "./Header";
import Home from "./Home";
import SimpleModalWrapped from "./SimpleModalWrapped";
import FormDialog from "./FormDialog";
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
      message: "",
      numMillionaires: 0,
      millionaireOneName: "",
      millionaireTwoName: "",
      richestName: null
    };
    this.setMessage = this.setMessage.bind(this);
    this.setMillionaire = this.setMillionaire.bind(this);
    this.getRichestName = this.getRichestName.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await getAccounts(web3);

      // Get the deployed instances

      const Enigma = await getContractInstance(web3, enigmaContractDefinition);
      const EnigmaToken = await getContractInstance(
        web3,
        enigmaTokenContractDefinition
      );
      const MillionairesProblemFactory = await getContractInstance(
        web3,
        millionairesProblemFactoryContract
      );

      const millionairesProblems = await MillionairesProblemFactory.getMillionairesProblems.call();
      if (millionairesProblems.length != 0) {
        const MillionairesProblem = await getContractInstance(
          web3,
          millionairesProblemContract,
          millionairesProblems[millionairesProblems.length - 1]
        );
        const millionairesInfo = await MillionairesProblem.getMillionaires.call();
        const millionaireNames = millionairesInfo[0];
        const millionaireEncryptedNetWorths = millionairesInfo[1];
        const numMillionaires = await MillionairesProblem.numMillionaires.call();
        const numMillionairesNumber = numMillionaires.toNumber();
        if (numMillionairesNumber == 2) {
          this.setState({
            millionaireOneName: web3.utils.toUtf8(millionaireNames[0]),
            millionaireTwoName: web3.utils.toUtf8(millionaireNames[1])
          });
        } else if (numMillionairesNumber == 1) {
          this.setState({
            millionaireOneName: web3.utils.toUtf8(millionaireNames[0])
          });
        }
        this.setState({
          MillionairesProblem,
          numMillionaires: numMillionairesNumber
        });
      }

      const enigma = new eng.Enigma(Enigma, EnigmaToken);
      const principal = new testUtils.Principal(Enigma, accounts[9]);
      const resultRegister = await principal.register();
      const eventRegister = resultRegister.logs[0];
      if (!eventRegister.args._success) {
        throw "Unable to register worker";
      }
      const resultWP = await principal.setWorkersParams();
      const eventWP = resultWP.logs[0];
      if (!eventWP.args._success) {
        throw "Unable to set worker params";
      }
      console.log("network using random seed:", eventWP.args.seed.toNumber());

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

  setMillionaire(name) {
    this.state.numMillionaires == 0
      ? this.setState({ millionaireOneName: name })
      : this.setState({ millionaireTwoName: name });
    this.setState({
      numMillionaires: this.state.numMillionaires + 1,
      message: ""
    });
  }

  async getRichestName() {
    let richestName = await this.state.MillionairesProblem.getRichestName.call();
    console.log(richestName);
    this.setState({ richestName });
  }

  async createNewMillionairesProblem() {
    this.setState({ message: "Creating new millionaires' problem" });
    await this.state.MillionairesProblemFactory.createNewMillionairesProblem({
      from: this.state.accounts[0],
      gas: GAS
    });

    const millionairesProblems = await this.state.MillionairesProblemFactory.getMillionairesProblems.call();
    const MillionairesProblem = await getContractInstance(
      this.state.web3,
      millionairesProblemContract,
      millionairesProblems[millionairesProblems.length - 1]
    );
    this.setState({
      MillionairesProblem,
      millionaireOneName: "",
      millionaireTwoName: "",
      numMillionaires: 0,
      message: "",
      richestName: null
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
              <h1>Number of Millionaires: {this.state.numMillionaires}</h1>
              <h2>Millionaire One: {this.state.millionaireOneName}</h2>
              <h2>Millionaire Two: {this.state.millionaireTwoName}</h2>
              {this.state.richestName == null ? (
                <h2>Richest Millionaire: TBD</h2>
              ) : (
                <h2>
                  Richest Millionaire:{" "}
                  {this.state.web3.utils.hexToAscii(this.state.richestName)}
                </h2>
              )}
              <FormDialog
                accounts={this.state.accounts}
                web3={this.state.web3}
                enigma={this.state.enigma}
                MillionairesProblem={this.state.MillionairesProblem}
                onSetMessage={this.setMessage}
                onSetMillionaire={this.setMillionaire}
                onGetRichestName={this.getRichestName}
                numMillionaires={this.state.numMillionaires}
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
