import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withRoomContext } from '../RoomContext';
import * as stateActions from '../actions/stateActions';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = (theme) =>
	({
		root :
		{
			display              : 'flex',
			width                : '100%',
			height               : '100%',
			backgroundColor      : 'var(--background-color)',
			backgroundImage      : `url(${window.config.background})`,
			backgroundAttachment : 'fixed',
			backgroundPosition   : 'center',
			backgroundSize       : 'cover',
			backgroundRepeat     : 'no-repeat'
		},
		dialogPaper :
		{
			width                          : '20vw',
			padding                        : theme.spacing(2),
			[theme.breakpoints.down('lg')] :
			{
				width : '30vw'
			},
			[theme.breakpoints.down('md')] :
			{
				width : '40vw'
			},
			[theme.breakpoints.down('sm')] :
			{
				width : '60vw'
			},
			[theme.breakpoints.down('xs')] :
			{
				width : '80vw'
			}
		},
		logo :
		{
			display : 'block'
		}
	});

const Lobby = ({
	roomClient,
	url,
	displayName,
	loginEnabled,
	changeDisplayName,
	classes
}) =>
{
	const handleKeyDown = (event) =>
	{
		const { key } = event;

		switch (key)
		{
			case 'Enter':
			case 'Escape':
			{
				if (displayName === '')
					changeDisplayName('Guest');
				break;
			}
			default:
				break;
		}
	};

	return (
		<div className={classes.root}>
			<Dialog
				open
				classes={{
					paper : classes.dialogPaper
				}}
			>
				{ window.config.logo &&
					<img alt='Logo' className={classes.logo} src={window.config.logo} />
				}
				<Typography variant='h2' align='center'>
					Virtual lobby
				</Typography>
				<Typography variant='h6'>
					You are currently in the virtual lobby of: {url}
					Please wait for someone to let you in.
				</Typography>
				<TextField
					id='displayname'
					label='Your name'
					className={classes.textField}
					value={displayName}
					onChange={(event) =>
					{
						const { value } = event.target;

						changeDisplayName(value);
					}}
					onKeyDown={handleKeyDown}
					onBlur={() =>
					{
						if (displayName === '')
							changeDisplayName('Guest');
					}}
					margin='normal'
				/>
				<DialogActions>
					{ loginEnabled &&
						<Button
							onClick={() =>
							{
								roomClient.login();
							}}
							variant='contained'
							color='secondary'
						>
							Sign in
						</Button>
					}
				</DialogActions>
			</Dialog>
		</div>
	);
};

Lobby.propTypes =
{
	roomClient        : PropTypes.any.isRequired,
	url               : PropTypes.string.isRequired,
	displayName       : PropTypes.string.isRequired,
	loginEnabled      : PropTypes.bool.isRequired,
	changeDisplayName : PropTypes.func.isRequired,
	classes           : PropTypes.object.isRequired
};

const mapStateToProps = (state) =>
{
	return {
		url          : state.room.url,
		displayName  : state.settings.displayName,
		loginEnabled : state.me.loginEnabled
	};
};

const mapDispatchToProps = (dispatch) =>
{
	return {
		changeDisplayName : (displayName) =>
		{
			dispatch(stateActions.setDisplayName(displayName));
		}
	};
};

export default withRoomContext(connect(
	mapStateToProps,
	mapDispatchToProps,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.room.url === next.room.url &&
				prev.settings.displayName === next.settings.displayName &&
				prev.me.loginEnabled === next.me.loginEnabled
			);
		}
	}
)(withStyles(styles)(Lobby)));