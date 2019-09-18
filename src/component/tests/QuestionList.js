import React, { useState, useEffect } from 'react'
import { Paper, Grid, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { truncateString, getType } from '../../utils/helpers'
import {withRouter} from 'react-router-dom';
import { getQuestionsForList } from '../../utils/api';

const useStyles = makeStyles(({
  '@global': {
    'html, body, #root': {
      height: '100%'
    } 
	},
  container: {
    marginTop: 5,
    height: 'calc(100% - 64px - 5px)'
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
  
  const { location } = props
  const postType = getType(location)

  const [list, setlist] = useState([])
  useEffect(() => {
    const handleGetQuestionsForList = async postType => {
      try {
        const questions = await getQuestionsForList(postType)
        console.log(questions)
        setlist(questions)
        setIsLoading(false)
      } catch(err) {
        throw Error('Get list error')
      }
    }

    handleGetQuestionsForList(postType)
      .catch(err => alert(err))
  }, [])

  return (
    <Grid container alignItems="stretch" className={classes.container}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Grid container justify="center">
            <Grid item className={classes.tableContainer}>
              <Typography
                variant='h5'
                className={classes.flex}
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

export default withRouter(QuestionList)
