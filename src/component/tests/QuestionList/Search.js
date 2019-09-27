import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { handleSearchRecords } from '../../../actions/questionList';
import { getType } from '../../../utils/helpers'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '2px 8px',
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

function Search(props) {
  const classes = useStyles();

  const [search, setSearch] = useState('')
  
  const handleChange = event => {
    setSearch(event.target.value)
    props.handleSearchRecords(props.postType, event.target.value)
  }

  return (
    <div className={classes.root}>
      <InputBase
        className={classes.input}
        placeholder="Search"
        inputProps={{ 'aria-label': 'search' }}
        value={search}
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
    postType
  }
}

export default withRouter(connect(mapStatesToProps, { handleSearchRecords })(Search))