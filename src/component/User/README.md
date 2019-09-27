# Modual Rule

This modual will implement login/logout and authentication. It's also a console for user management.

## About user management

The user should have the right to control settings for their tests.

- Settings include how many questions for one test, randomize the question order or not.

- Every question should have a block button. Users can choose to block this question so it will never appear in the user's test again. Other users who didn't block this question still can see the question in their test.

  This requires users should have lists of question ID for all the tests. Once he or she blocks a question, the ID of that question will be removed from in his/her related list.

- The question list for users to check will render from question itself so users still can see all the questions. Questions not in his list will be tagged as blocked. Here a restore button from blocked can be used. On the contrary, a block button can stand for those still in the user's list.

- When initializing, all the questions for the current test, 10 or other counts based on the user's setting, will not be loaded altogether. The app will manipulate the user's list, randomizing and taking the first n numbers of question IDs, then load them one by one by clicking next button.

  The loaded questions will be put in Redux as part of the state of the app.
