import React from "react";
import { 
  withStyles, 
  MobileStepper, 
  Button, 
  Grid 
} from '@material-ui/core';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { connect } from 'react-redux'

import { handleNext, handleBack } from "../../actions/test/shared";

const ProgressingBar = 
  ({ 
    testQuestions, 
    currentQuestionNumber, 
    handleNext, 
    handleBack, 
    theme, 
    classes 
  }) => 
  <Grid container className={classes.container}>
    <Grid item xs={12}>
      <MobileStepper
        variant="progress"
        steps={testQuestions.length + 1}
        position="static"
        activeStep={currentQuestionNumber + 1}
        
        nextButton={
          <Button 
            size="small" 
            onClick={handleNext} 
            disabled={currentQuestionNumber === testQuestions.length - 1}
          >
            Next
            {theme.direction === 'rtl' 
            ? <KeyboardArrowLeft /> 
            : <KeyboardArrowRight />}
          </Button>
        }

        backButton={
          <Button 
            size="small" 
            onClick={handleBack} 
            disabled={currentQuestionNumber === 0}
          >
            {theme.direction === 'rtl' 
            ? <KeyboardArrowRight /> 
            : <KeyboardArrowLeft />}
            Back
          </Button>
        }
      />
    </Grid>
  </Grid>

const mapStateToProps = ({ 
  test: { testQuestions, currentQuestionNumber } 
}) => {
  return {
    testQuestions,
    currentQuestionNumber
  }
}

const styles = theme => ({
  container: {
    marginTop: 10
  }
})

export default connect(
  mapStateToProps,
  { handleNext, handleBack }
)(withStyles(styles, { withTheme: true })(ProgressingBar))
