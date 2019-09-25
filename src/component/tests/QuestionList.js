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
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'

import { truncateString, getType } from '../../utils/helpers'
import { 
  handleGetList, 
  handleChangeRowsPerPage, 
  handleResetQuestionList, 
} from '../../actions/questionList';
import TablePaginationActions from './TablePaginationActions'
import CreateDialog from './Dialog'

const useStyles = makeStyles(({
  container: {
    marginTop: 5,
    minHeight: 'calc(100% - 64px - 5px)',
  },
  paper: {
    height: '100%'
  },
  tableContainer: {
    width: '70%',
    paddingTop: 60,
    paddingBottom: 60
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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = React.useState(null);

  const { 
    questionList: { 
      rowsPerPage, page, offset, totalQuestions, list 
    },
    postType,
  } = props

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    props.handleResetQuestionList()

    const { handleGetList } = props
    handleGetList(postType)
      .then(res => setIsLoading(false))
      .catch(err => alert(err))
  }, [])

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, list.length - page * rowsPerPage);

  function handleChangePage(event, newPage) {
    // setPage(newPage);
  }

  function handleChangeRPPage(event) {
    const { handleChangeRowsPerPage } = props
    handleChangeRowsPerPage(postType, parseInt(event.target.value, 10))
  }

  function handleClickRow(event, id) {
    selected === id ? setSelected(null) : setSelected(id)

    setDialogOpen(true)
  }

  const isSelected = id => selected === id;

  

  // const handleClickOpen = () => {
  //   setDialogOpen(true)
  // };

  const onClose = () => {
    setDialogOpen(false)
    setSelected(null)
  };

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
                      {list.map(row => {
                        const isItemSelected = isSelected(row.id);

                        return (
                          <TableRow 
                            key={row.id} 
                            hover={true} 
                            onClick={(event) => handleClickRow(event, row.id)} 
                            selected={isItemSelected}
                          >
                            <TableCell component="th" scope="row">
                              {row.id}
                            </TableCell>
                            <TableCell align="right" dangerouslySetInnerHTML={{ __html: truncateString(row.title.rendered)}}></TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                            <TableCell align="right">{row.date_gmt}</TableCell>
                          </TableRow>
                        )
                      })}
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
                  <CreateDialog 
                    comeFrom="questionList"
                    open={dialogOpen}
                    onClose={onClose}
                    qid={selected}
                  />
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
  { handleGetList, handleChangeRowsPerPage, handleResetQuestionList }
)(QuestionList))

