import React from 'react';
import classNames from 'classnames';
import { 
  withStyles, 
  Typography, 
  NoSsr, 
  TextField, 
  Paper, 
  Chip, 
  MenuItem 
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import CreatableSelect from 'react-select/creatable';
import { connect } from 'react-redux'

import { handleAddTagToDB } from '../../../actions/tags';
import { getError } from '../../../actions/appStatus';

// https://material-ui.com/components/autocomplete/ The source of this component

const NoOptionsMessage = props => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

const inputComponent = ({ inputRef, ...props }) => {
  return <div ref={inputRef} {...props} />;
}

const Control = props => {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          children: props.children,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

const Option = props => {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
      
    >
      {props.children}
    </MenuItem>
  );
}

const Placeholder = props => {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

const ValueContainer = props => {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

const MultiValue = props => {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

const Menu = props => {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  ValueContainer,
};

class Tags extends React.Component {
  setTags = tagArr => (
    tagArr.map(tag => ({
      value: tag,
      label: tag,
    }))
  )

  handleChange = value => {
    this.props.onTagChange(value)
  };

  handleCreate = inputValue => {
    const newOption = this.createOption(inputValue)
    const { ownedTags, getError } = this.props
    const newTagArr = [...this.setTags(ownedTags), newOption]

    this.handleChange(newTagArr)

    this.props.handleAddTagToDB(inputValue)
      .catch(err => {
        this.handleChange(this.setTags(ownedTags))
        // alert(err)
        getError(err)
      })
  };
  
  createOption = label => ({
    label,
    value: label
  })

  render() {
    const { classes, theme, ownedTags, suggestions } = this.props

    const formattedTags = ownedTags ? this.setTags(ownedTags) : []
    const formattedSuggestions = this.setTags(suggestions)

    const selectStyles = {
      input: base => ({
        ...base,
        color: theme.palette.text.primary,
        '& input': {
          font: 'inherit',
        },
      }),
    };

    return (
      <div className={classes.root}>
        <Typography>
          Tags
        </Typography>
        <div className={classes.contentContainer}>
          <NoSsr>
            <CreatableSelect
              isClearable
              classes={classes}
              styles={selectStyles}
              options={formattedSuggestions}
              components={components}
              value={formattedTags}
              onChange={this.handleChange}
              onCreateOption={this.handleCreate}
              placeholder="Choose tags"
              isMulti
              className={classes.white}
            />
          </NoSsr>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ tags }, { ownedTags }) => {
  return {
    suggestions: tags,
    ownedTags
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  input: {
    display: 'flex',
    padding: 0,
    height: 'auto',
  },
  valueContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  chip: {
    margin: theme.spacing(0.5, 0.25),
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  noOptionsMessage: {
    padding: theme.spacing(1, 2),
  },
  placeholder: {
    position: 'absolute',
    left: 2,
    fontSize: 16,
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
  },
  contentContainer: {
    marginTop: 8,
    marginBottom: 8
  },
  white: {
    backgroundColor: 'white',
    borderRadius: 5,
  }
});

export default connect(
  mapStateToProps, 
  { handleAddTagToDB, getError }
)(withStyles(styles, { withTheme: true })(Tags));
