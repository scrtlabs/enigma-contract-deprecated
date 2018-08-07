import React, { Component } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AutorenewIcon from "@material-ui/icons/Autorenew";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import CircularProgress from "@material-ui/core/CircularProgress";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Message } from "semantic-ui-react";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";

function createData(
  providerName,
  name,
  engPrice,
  price,
  subscriptionsNum,
  subscribed,
  endDate,
  counter
) {
  return {
    id: counter,
    providerName,
    name,
    engPrice,
    price,
    subscriptionsNum,
    subscribed,
    endDate
  };
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => {
        if (b[orderBy] == a[orderBy]) {
          return b["name"] < a["name"] ? -1 : 1;
        }
        return b[orderBy] < a[orderBy] ? -1 : 1;
      }
    : (a, b) => {
        if (b[orderBy] == a[orderBy]) {
          return a["name"] < b["name"] ? -1 : 1;
        }
        return a[orderBy] < b[orderBy] ? -1 : 1;
      };
}

const columnData = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Name"
  },
  { id: "price", numeric: true, disablePadding: false, label: "Price (ENG)" },
  {
    id: "subscriptionsNum",
    numeric: true,
    disablePadding: false,
    label: "Subscriptions #"
  },
  {
    id: "subscribed",
    numeric: true,
    disablePadding: false,
    label: "Already Subscribed"
  },
  {
    id: "endDate",
    numeric: true,
    disablePadding: false,
    label: "End Date"
  }
];

class FullMarketplaceTableHead extends Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
            />
          </TableCell>
          {columnData.map(column => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderBy === column.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={column.numeric ? "bottom-end" : "bottom-start"}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={order}
                    onClick={this.createSortHandler(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

FullMarketplaceTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

class FullMarketplaceTableToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.data != nextProps.data) {
      this.setState({ data: nextProps.data });
    }
  }

  render() {
    const { selected, classes } = this.props;
    const data = this.state.data;
    let toolbarActionButton;
    if (selected.length > 0) {
      if (data[selected[0]].subscribed == "false") {
        toolbarActionButton = (
          <Tooltip title="Subscribe">
            <IconButton
              aria-label="Subscribe"
              // onClick={this.props.onSubscribe(selected[0])}
              onClick={() => {
                this.props.onSubscribe(selected[0]);
              }}
            >
              <AddShoppingCartIcon />
            </IconButton>
          </Tooltip>
        );
      }
    } else {
      toolbarActionButton = (
        <Tooltip title="Filter list">
          <IconButton aria-label="Filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      );
    }
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: selected.length > 0
        })}
      >
        <div className={classes.title}>
          {selected.length > 0 ? (
            <Typography color="inherit" variant="subheading">
              {data[selected[0]].name} selected
            </Typography>
          ) : (
            <Typography variant="title" id="tableTitle">
              Enigma Catalyst Data Marketplace
            </Typography>
          )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>{toolbarActionButton}</div>
      </Toolbar>
    );
  }
}

FullMarketplaceTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  selected: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired
};

FullMarketplaceTableToolbar = withStyles(toolbarStyles)(
  FullMarketplaceTableToolbar
);

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3
  },
  table: {
    minWidth: 1020
  },
  tableWrapper: {
    overflowX: "auto"
  },
  progress: {
    margin: theme.spacing.unit * 2
  }
});

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

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
    this.state = { open: false, subscribingMessage: "" };
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({ open: false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.subscribingMessage != nextProps.subscribingMessage) {
      nextProps.subscribingMessage == ""
        ? this.setState({
            open: false,
            subscribingMessage: nextProps.subscribingMessage
          })
        : this.setState({
            open: true,
            subscribingMessage: nextProps.subscribingMessage
          });
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <Typography gutterBottom>
          Click to get the full Modal experience!
        </Typography>
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
              {this.state.subscribingMessage}
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

class FullMarketplaceTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "desc",
      orderBy: "subscriptionsNum",
      selected: [],
      data: [],
      page: 0,
      rowsPerPage: 10,
      subscribingMessage: ""
    };
  }

  async componentDidMount() {
    let data = [];
    const numDataSources = await this.props.contract.methods
      .getProviderNamesSize()
      .call();
    let providerInfos = [];
    let subscribedIndices = [];
    for (let k = 0; k < numDataSources; k++) {
      let providerName = await this.props.contract.methods.getNameAt(k).call();
      let info = await this.props.contract.methods
        .getDataProviderInfo(providerName)
        .call();
      let subscriptionInfo = await this.props.contract.methods
        .checkAddressSubscription(this.props.accounts[0], providerName)
        .call();
      if (subscriptionInfo[5]) {
        subscribedIndices.push(k);
      }
      let subscribed = subscriptionInfo[5] ? "true" : "false";
      let endDate = subscriptionInfo[4];

      providerInfos.push({
        id: k,
        name: this.props.web3.utils.hexToUtf8(providerName),
        price: info[1] / Math.pow(10, 8),
        subscriptionsNum: info[3],
        subscribed: subscribed,
        endDate: endDate
      });
      data.push(
        createData(
          providerName,
          this.props.web3.utils.hexToUtf8(providerName),
          info[1],
          info[1] / Math.pow(10, 8),
          info[3],
          subscribed,
          endDate,
          k
        )
      );
    }
    this.setState({ data });
  }

  async subscribe(id) {
    this.setState({
      subscribingMessage:
        "Subscribing Step 1 of 2: This transaction allows the marketplace to spend ENG on your behalf. Please wait 20-30 seconds..."
    });
    let { data } = this.state;
    data[id].subscribed = "pending";
    this.setState({ data });
    let { providerName, name, engPrice, price, subscribed } = data[id];

    try {
      await this.props.engContract.methods
        .approve(this.props.contract.options.address, engPrice)
        .send({
          from: this.props.accounts[0]
        });

      this.setState({
        subscribingMessage:
          "Subscribing Step 2 of 2: This transaction carries out the actual subscription to the dataset. Please wait 20-30 seconds..."
      });

      await this.props.contract.methods.subscribe(providerName).send({
        from: this.props.accounts[0]
      });
    } catch (err) {
      console.log(err.message);
    }

    let info = await this.props.contract.methods
      .getDataProviderInfo(providerName)
      .call();
    let subscriptionsNum = info[3];
    let subscriptionInfo = await this.props.contract.methods
      .checkAddressSubscription(this.props.accounts[0], providerName)
      .call();
    subscribed = subscriptionInfo[5] ? "true" : "false";
    data[id].subscriptionsNum = subscriptionsNum;
    data[id].subscribed = subscribed;
    data[id].endDate = subscriptionInfo[4];
    this.setState({ data, subscribingMessage: "" });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [id];
    } else {
      newSelected = [];
    }
    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows =
      rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        <FullMarketplaceTableToolbar
          selected={selected}
          data={this.state.data}
          onSubscribe={id => {
            this.subscribe(id);
          }}
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <FullMarketplaceTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {data
                .concat()
                .sort(getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  let subscribed = n.subscribed;
                  let subscribedIcon;
                  if (subscribed == "true") {
                    subscribedIcon = (
                      <CheckCircleIcon style={{ color: "green" }} />
                    );
                  } else if (subscribed == "pending") {
                    subscribedIcon = <CircularProgress />;
                  } else {
                    subscribedIcon = <CancelIcon style={{ color: "red" }} />;
                  }
                  let endDate =
                    subscribed == "true"
                      ? this.formatDate(n.endDate * 1000)
                      : "";
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell numeric>{n.price}</TableCell>
                      <TableCell numeric>{n.subscriptionsNum}</TableCell>
                      <TableCell numeric>{subscribedIcon}</TableCell>
                      <TableCell numeric>{endDate}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page"
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page"
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <SimpleModalWrapped
          subscribingMessage={this.state.subscribingMessage}
        />
      </Paper>
    );
  }
}

FullMarketplaceTable.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FullMarketplaceTable);
