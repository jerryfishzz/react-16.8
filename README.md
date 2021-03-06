# Handy Test

A multichoice self-test app. Write down your study notes then review them.

The app will only show 10 questions each time. So don't worry it will be a dull and boring one. The 10 questions are randomly taken from the database. So again, don't worry about it will be a dull and boring repeating work every time you go : )

## Installation

Just `npm install` and `npm start`, then enjoy it.

## Built With

- Redux for state management

- [Material UI]  The main UI library used in this project.

- [React Select] For dropdown menu

- [Draft.js] For rich text editor

- [Wordpress] Wordpress API to communicate with front-end and server-side

## Memo for fixes

- The [solution] for Microsoft Edge

  *./node_modules/react-dev-utils/webpackHotDevClient.js:60* add `slashes: true`

```javascript
// Connect to WebpackDevServer via a socket.
var connection = new WebSocket(
  url.format({
    protocol: window.location.protocol === 'https:' ? 'wss' : 'ws',
    hostname: window.location.hostname,
    port: window.location.port,
    // Hardcoded in WebpackDevServer
    pathname: '/sockjs-node',
    slashes: true,
  })
);
```

- State: lastAction
  
  The display text about the current action for error alert.
  
  Not all the actions need this state to monitor, currently used on editing (value: `Editing`) and deleting (value: `Deleting`) actions.

[Material UI]: https://material-ui.com/

[React Select]: https://react-select.com/home

[mobile flashcard]: https://github.com/jerryfishzz/mobile-flashcards

[Draft.js]: https://draftjs.org/

[Wordpress]: https://developer.wordpress.org/rest-api/

[solution]: https://github.com/facebook/create-react-app/issues/8084#issuecomment-562981098
