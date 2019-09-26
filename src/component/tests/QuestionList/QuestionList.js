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

import { truncateString, getType } from '../../../utils/helpers'
import { 
  handleGetList, 
  handleChangeRowsPerPage, 
  handleResetQuestionList, 
} from '../../../actions/questionList';
import TablePaginationActions from './TablePaginationActions'
import CreateDialog from '../Dialog'
import Search from './Search';

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
  row: {
    '&:hover': {
      cursor: 'pointer'
    }
  }
}))

const QuestionList = (props) => {
  const classes = useStyles()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selected, setSelected] = React.useState(null);

  const { 
    questionList: { 
      rowsPerPage, page, totalQuestions, list 
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

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, totalQuestions - page * rowsPerPage);

  function handleChangeRPPage(event) {
    const { handleChangeRowsPerPage } = props
    handleChangeRowsPerPage(postType, parseInt(event.target.value, 10))
  }

  function handleClickRow(event, id) {
    selected === id ? setSelected(null) : setSelected(id)

    setDialogOpen(true)
  }

  const isSelected = id => selected === id;

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
              <Search />
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
                            className={classes.row}
                          >
                            <TableCell component="th" scope="row">
                              {row.id}
                            </TableCell>
                            <TableCell 
                              align="right" 
                              dangerouslySetInnerHTML={{ 
                                __html: truncateString(row.title.rendered)
                              }}
                            >
                            </TableCell>
                            <TableCell align="right">{row.modified}</TableCell>
                            <TableCell align="right">{row.date}</TableCell>
                          </TableRow>
                        )
                      })}

                      {emptyRows > 0 && (
                        <TableRow style={{ height: 48 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25]}
                          colSpan={4}
                          count={totalQuestions}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          SelectProps={{
                            inputProps: { 'aria-label': 'rows per page' },
                            native: true,
                          }}
                          onChangePage={() => null}
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

