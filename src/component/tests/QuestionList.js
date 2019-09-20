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
import { handleGetList } from '../../actions/questionList';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage, offset } = props;

  function handleFirstPageButtonClick(event) {
    onChangePage(event, 0);
  }

  function handleBackButtonClick(event) {
    onChangePage(event, page - 1);
  }

  function handleNextButtonClick(event) {
    onChangePage(event, page + 1);
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

const useStyles = makeStyles(({
  container: {
    marginTop: 5,
    height: 'calc(100% - 64px - 5px)',
  },
  paper: {
    height: '100%'
  },
  tableContainer: {
    width: '70%',
    // backgroundColor: 'yellow',
    paddingTop: 100
  },
  tablePaper: {
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}))

const QuestionList = (props) => {
  const classes = useStyles()

  const [isLoading, setIsLoading] = useState(true)

  const [totle, setTotle] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
  const [offset, setOffset] = useState(0)

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  const { location } = props
  const postType = getType(location)

  const handleGetQuestionsForList = async (postType, offset, perPage) => {
    setIsLoading(true)
    try {
      // const questions = await getQuestionsForList(postType)
      const { data, headers } = await getQuestionsForListAxios(postType, offset, perPage)
      console.log(headers)
      setlist(data)
      setTotle(Number(headers['x-wp-total']))
      setTotalPage(Number(headers['x-wp-totalpages']))

      setIsLoading(false)
    } catch(err) {
      throw Error('Get list error')
    }
  }

  const [list, setlist] = useState([])
  useEffect(() => {
    handleGetQuestionsForList(postType, offset, rowsPerPage)
      .catch(err => alert(err))

    const { postType: p, questionList, handleGetList } = props
    console.log(p, questionList)
    handleGetList(p, questionList.offset, questionList.perPage)
      .catch(err => alert(err))
  }, [])

  

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);

  function handleChangePage(event, newPage) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  function handleChangeOffset(event) {
    setOffset(offset + rowsPerPage)
  }

  return (
    <Grid container alignItems="stretch" className={classes.container}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Grid container justify="center">
            <Grid item className={classes.tableContainer}>
              <Typography
                variant='h5'
                gutterBottom
              >
                {!isLoading ? 'Question List' : 'Loading'}
              </Typography>
              {!isLoading && (
                <Paper className={classes.tablePaper}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell align="right">Title</TableCell>
                        <TableCell align="right">Last Update</TableCell>
                        <TableCell align="right">Time Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(row => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.id}
                          </TableCell>
                          <TableCell align="right" dangerouslySetInnerHTML={{ __html: truncateString(row.title.rendered)}}></TableCell>
                          <TableCell align="right">{row.date}</TableCell>
                          <TableCell align="right">{row.date_gmt}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          colSpan={3}
                          count={totle}
                          rowsPerPage={rowsPerPage}
                          offset={offset}
                          page={page}
                          SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                          }}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRowsPerPage}
                          ActionsComponent={TablePaginationActions}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </Paper>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  )
}

const mapStatesToProps = ({ questionList }, { location }) => {
  const postType = getType(location)

  // getQuestionsForListAxios(postType, offset, perPage)

  return {
    questionList,
    postType
  }
}

export default withRouter(connect(
  mapStatesToProps,
  { handleGetList }
)(QuestionList))

