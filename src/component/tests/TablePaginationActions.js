import React, { useState, useEffect } from 'react'
import { 
  Paper, 
  Grid, 
  Typography, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  TableFooter,
  TablePagination,
  IconButton
} from '@material-ui/core'

import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';

import { makeStyles, useTheme } from '@material-ui/styles'
import { truncateString, getType } from '../../utils/helpers'
import { withRouter } from 'react-router-dom';
import { getQuestionsForList, getQuestionsForListAxios } from '../../utils/api';
import { connect } from 'react-redux'
import { handleGetList, handleNextPage, nextPage } from '../../actions/questionList';
import { prototype } from 'events';


const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

const TablePaginationActions = (props) => {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage, handleNextPage, postType, questionList: { offset }, dispatch } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    // onChangePage(event, page + 1);\
    console.log(postType, offset, rowsPerPage)
//     dispatch(nextPage(rowsPerPage))
// console.log(offset)
    // dispatch(handleGetList(postType, offset, rowsPerPage))
    //   .catch(err => alert(err))

    handleNextPage(postType, rowsPerPage)
  }

  function handleLastPageButtonClick(event) {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  }

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const mapStatesToProps = ({ questionList }, { location }) => {
  const postType = getType(location)

  // getQuestionsForListAxios(postType, offset, perPage)

  return {
    questionList,
    postType
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch
  }
}

export default withRouter(connect(
  mapStatesToProps, 
  // mapDispatchToProps,
  { handleNextPage }
)(TablePaginationActions))
