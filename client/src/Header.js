import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

const styles = {
	root: {
		flexGrow: 1
	},
	flex: {
		flex: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	}
};

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { classes } = this.props;
		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<Typography
							variant="title"
							color="inherit"
							className={classes.flex}
							component={props => <Link to="/" {...props} />}
						>
							Enigma Millionaire's Problem
						</Typography>
						<Tooltip title="Create New Millionaires' Problem">
							<IconButton
								aria-label="createNewMillionairesProblem"
								onClick={() => {
									this.props.onCreateNewMillionaresProblem();
								}}
							>
								<AddIcon />
							</IconButton>
						</Tooltip>
					</Toolbar>
				</AppBar>
			</div>
		);
	}
}

Header.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
