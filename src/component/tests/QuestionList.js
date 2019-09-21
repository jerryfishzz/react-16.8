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
} from '@material-ui/core'

import { makeStyles } from '@material-ui/styles'
import { truncateString, getType } from '../../utils/helpers'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { handleGetList, handleChangeRowsPerPage } from '../../actions/questionList';
import TablePaginationActions from './TablePaginationActions'

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

  const { 
    questionList: { 
      rowsPerPage, page, offset, totalQuestions, totalPages, list 
    },
    postType,

  } = props

  const [isLoading, setIsLoading] = useState(true)

  // const [totle, setTotle] = useState(0)
  // const [totalPage, setTotalPage] = useState(0)
  // const [offset, setOffset] = useState(0)

  // const [page, setPage] = React.useState(0);
  // const [rowsPerPage, setRowsPerPage] = React.useState(5);
  
  // const { location } = props
  // const postType = getType(location)

  // const handleGetQuestionsForList = async (postType, offset, rowsPerPage) => {
  //   setIsLoading(true)
  //   try {
  //     // const questions = await getQuestionsForList(postType)
  //     const { data, headers } = await getQuestionsForListAxios(postType, offset, rowsPerPage)
  //     console.log(headers)
  //     // setlist(data)
  //     // setTotle(Number(headers['x-wp-total']))
  //     // setTotalPage(Number(headers['x-wp-totalpages']))

  //     setIsLoading(false)
  //   } catch(err) {
  //     throw Error('Get list error')
  //   }
  // }

  // const [list, setlist] = useState([])
  useEffect(() => {
    setIsLoading(true)

    // handleGetQuestionsForList(postType, offset, rowsPerPage)
    //   .catch(err => alert(err))

    const { handleGetList } = props
    // console.log(p, questionList)
    handleGetList(postType)
      .then(res => setIsLoading(false))
      .catch(err => alert(err))
  }, [])

  

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);




  function handleChangePage(event, newPage) {
    // setPage(newPage);
  }

  function handleChangeRPPage(event) {
    // setRowsPerPage(parseInt(event.target.value, 10));
    // setPage(0);

    const { handleChangeRowsPerPage } = props
    handleChangeRowsPerPage(postType, parseInt(event.target.value, 10))
  }





  // function handleChangeOffset(event) {
  //   setOffset(offset + rowsPerPage)
  // }

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
                      {list.map(row => (
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
                          count={totalQuestions}
                          rowsPerPage={rowsPerPage}
                          offset={offset}
                          page={page}
                          SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                          }}
                          onChangePage={handleChangePage}
                          onChangeRowsPerPage={handleChangeRPPage}
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

  return {
    questionList,
    postType
  }
}

export default withRouter(connect(
  mapStatesToProps,
  { handleGetList, handleChangeRowsPerPage }
)(QuestionList))

