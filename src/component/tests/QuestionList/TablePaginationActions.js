import React from 'react'
import { IconButton } from '@material-ui/core'
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { makeStyles, useTheme } from '@material-ui/styles'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import { getPostType } from '../../../utils/helpers'
import { 
  handleNextPage, 
  handlePreviousPage, 
  handleFirstPage, 
  handleLastPage 
} from '../../../actions/questionList';
import { getError } from '../../../actions/appStatus';

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
  const { 
    handleNextPage, 
    handlePreviousPage, 
    handleFirstPage, 
    handleLastPage, 
    postType, 
    questionList: { 
      totalQuestions: count, page, rowsPerPage, 
    },
    getError
  } = props;

  function handleFirstPageButtonClick(event) {
    handleFirstPage(postType, rowsPerPage)
      .catch(err => {
        // alert(err)
        getError(err)
      })
  }

  function handleBackButtonClick(event) {
    handlePreviousPage(postType, rowsPerPage)
      .catch(err => {
        // alert(err)
        getError(err)
      })
  }

  function handleNextButtonClick(event) {
    handleNextPage(postType, rowsPerPage)
      .catch(err => {
        // alert(err)
        getError(err)
      })
  }

  function handleLastPageButtonClick(event) {
    handleLastPage(postType)
      .catch(err => {
        // alert(err)
        getError(err)
      })
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
      <IconButton 
        onClick={handleBackButtonClick} 
        disabled={page === 0} 
        aria-label="previous page"
      >
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

const mapStatesToProps = ({ questionList }, { location: { pathname }}) => ({
  questionList,
  postType: getPostType(pathname)
})

export default withRouter(connect(
  mapStatesToProps, 
  { handleNextPage, handlePreviousPage, handleFirstPage, handleLastPage, getError }
)(TablePaginationActions))
