import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import { searchRecords, handleGetList } from '../../../actions/questionList';
import { getType } from '../../../utils/helpers'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 2px 2px 12px',
    display: 'flex',
    alignItems: 'center',
    width: 320,
    border: '1px solid rgba(224, 224, 224, 0.5)',
    borderRadius: 24
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

function Search({ postType, searchRecords, handleGetList }) {
  const classes = useStyles();

  const handleChange = event => {
    searchRecords(event.target.value)
    handleGetList(postType)
      .catch(err => alert(err))
  }

  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        onChange={handleChange}
      />
      <IconButton className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton>
    </div>
  );
}

const mapStatesToProps = (state, { location }) => {
  const postType = getType(location)

  return {
    postType,
  }
}

export default withRouter(connect(
  mapStatesToProps, 
  { handleGetList, searchRecords }
)(Search))