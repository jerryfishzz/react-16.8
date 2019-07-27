import * as R from 'ramda'

export const questionLibrary = [
  {
    "id": "jvcx8cmv",
    "question": "Which of commands is to create a database named runoob.",
    "answers": [
      {
        "content": "use runoob",
        "correctness": true,
        "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at neque eget nisi congue lacinia. In sem felis, porttitor eu interdum pulvinar, pretium a elit. Phasellus varius tortor a nisl pretium egestas. Mauris arcu sapien, placerat et dictum ut, dictum sed quam."
      },
      {
        "content": "create runoob",
        "correctness": false,
        "note": "Etiam vel nibh a sem venenatis sagittis nec quis velit. Nunc quis elementum enim. Mauris eget dictum metus. Maecenas at porta magna. Vivamus aliquam vestibulum dolor non finibus. Nam suscipit augue in arcu tincidunt, et euismod neque condimentum. Proin at nisi tincidunt, scelerisque diam a, iaculis ligula."
      },
      {
        "content": "run runoob",
        "correctness": false,
        "note": ""
      },
      {
        "content": "build runoob",
        "correctness": false,
        "note": ""
      }
    ],
    "otherNotes": "Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent aliquet fermentum turpis. Morbi vel rutrum nulla. Cras euismod sem magna. Nullam id odio tempus, pulvinar sapien sit amet, scelerisque eros. Curabitur aliquam, augue vel venenatis posuere, lorem leo rhoncus est, quis viverra elit elit a nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus a scelerisque leo. Mauris viverra purus quis orci suscipit, id rhoncus ex pharetra. Nam vestibulum ligula sit amet aliquet bibendum. Praesent at aliquet eros, eu sodales nulla. Donec eget suscipit enim, et blandit sapien. Aliquam erat volutpat. Nullam finibus lobortis varius. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent aliquet fermentum turpis. Morbi vel rutrum nulla. Cras euismod sem magna. Nullam id odio tempus, pulvinar sapien sit amet, scelerisque eros. Curabitur aliquam, augue vel venenatis posuere, lorem leo rhoncus est, quis viverra elit elit a nibh. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus a scelerisque leo. Mauris viverra purus quis orci suscipit, id rhoncus ex pharetra. Nam vestibulum ligula sit amet aliquet bibendum. Praesent at aliquet eros, eu sodales nulla. Donec eget suscipit enim, et blandit sapien. Aliquam erat volutpat. Nullam finibus lobortis varius. Nam porttitor dignissim ligula, vel tristique ipsum tincidunt vitae. Nam faucibus quis justo in tempor."
  },
  {
    "id": "jvcxf19t",
    "question": "Inside which HTML element do we put the JavaScript?",
    "answers": [
      {
        "content": "<js>",
        "correctness": false,
        "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at neque eget nisi congue lacinia. In sem felis, porttitor eu interdum pulvinar, pretium a elit. Phasellus varius tortor a nisl pretium egestas. Mauris arcu sapien, placerat et dictum ut, dictum sed quam."
      },
      {
        "content": "<javascript>",
        "correctness": false,
        "note": "Etiam vel nibh a sem venenatis sagittis nec quis velit. Nunc quis elementum enim. Mauris eget dictum metus. Maecenas at porta magna. Vivamus aliquam vestibulum dolor non finibus. Nam suscipit augue in arcu tincidunt, et euismod neque condimentum. Proin at nisi tincidunt, scelerisque diam a, iaculis ligula."
      },
      {
        "content": "<script>",
        "correctness": true,
        "note": ""
      },
      {
        "content": "<scripting>",
        "correctness": false,
        "note": ""
      }
    ],
  },
  {
    "id": "jvcxfrhh",
    "question": "What is the correct JavaScript syntax to change the content of the HTML element below?<p id=\"demo\">This is a demonstration.</p>",
    "answers": [
      {
        "content": "document.getElementById(\"demo\").innerHTML = \"Hello World!\"",
        "correctness": true,
        "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at neque eget nisi congue lacinia. In sem felis, porttitor eu interdum pulvinar, pretium a elit. Phasellus varius tortor a nisl pretium egestas. Mauris arcu sapien, placerat et dictum ut, dictum sed quam."
      },
      {
        "content": "document.getElementByName(\"p\").innerHTML = \"Hello World!\"",
        "correctness": false,
        "note": "Etiam vel nibh a sem venenatis sagittis nec quis velit. Nunc quis elementum enim. Mauris eget dictum metus. Maecenas at porta magna. Vivamus aliquam vestibulum dolor non finibus. Nam suscipit augue in arcu tincidunt, et euismod neque condimentum. Proin at nisi tincidunt, scelerisque diam a, iaculis ligula."
      },
      {
        "content": "document.getElement(\"p\").innerHTML = \"Hello World!\"",
        "correctness": false,
        "note": ""
      },
      {
        "content": "#demo.innerHTML = \"Hello World!\"",
        "correctness": false,
        "note": ""
      }
    ],
  },
  {
    "id": "jvcxg7ku",
    "question": "Where is the correct place to insert a JavaScript?",
    "answers": [
      {
        "content": " The <body> section",
        "correctness":false,
        "note": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus at neque eget nisi congue lacinia. In sem felis, porttitor eu interdum pulvinar, pretium a elit. Phasellus varius tortor a nisl pretium egestas. Mauris arcu sapien, placerat et dictum ut, dictum sed quam."
      },
      {
        "content": "The <head> section",
        "correctness": false,
        "note": "Etiam vel nibh a sem venenatis sagittis nec quis velit. Nunc quis elementum enim. Mauris eget dictum metus. Maecenas at porta magna. Vivamus aliquam vestibulum dolor non finibus. Nam suscipit augue in arcu tincidunt, et euismod neque condimentum. Proin at nisi tincidunt, scelerisque diam a, iaculis ligula."
      },
      {
        "content": "Both the <head> section and the <body> section are correct",
        "correctness": true,
        "note": ""
      },
    ],
  },
  {
    "id": "jvcxgnwa",
    "question": "Which of the following expressions is problematic? Consume that count is not defined anywhere in the context.",
    "answers": [
      {
        "content": "var getPrice = count => count * 4.00",
        "correctness": false,
        "note": "Mauris luctus, arcu vitae ornare finibus, felis ipsum eleifend erat, ut rhoncus ipsum purus quis lectus. Maecenas ut cursus sapien, eu dapibus risus. Mauris sed augue vulputate erat sagittis consequat. Nulla suscipit commodo mauris. Nullam tristique eros nisl, tempor sodales tellus rutrum eu. Etiam blandit purus eu eros efficitur, ut condimentum quam sodales. Sed pharetra euismod ligula, nec faucibus eros rutrum suscipit. Sed id felis nibh. Praesent a condimentum quam, in ullamcorper erat. Nulla facilisi. Aliquam non massa quis neque consequat vestibulum.Nullam tristique eros nisl, tempor sodales tellus rutrum eu. Etiam blandit purus eu eros efficitur, ut condimentum quam sodales. "
      },
      {
        "content": "var getPrice = (count) => count * 4.00",
        "correctness": false,
        "note": ""
      },
      {
        "content": "var getPrice = () => count * 4.00",
        "correctness": true,
        "note": "Nullam tristique eros nisl, tempor sodales tellus rutrum eu. Etiam blandit purus eu eros efficitur, ut condimentum quam sodales. Sed pharetra euismod ligula, nec faucibus eros rutrum suscipit. Sed id felis nibh. Praesent a condimentum quam, in ullamcorper erat. Nulla facilisi. Aliquam non massa quis neque consequat vestibulum.Nullam tristique eros nisl, tempor sodales tellus rutrum eu. Etiam blandit purus eu eros efficitur, ut condimentum quam sodales. Sed pharetra euismod ligula, nec faucibus eros rutrum suscipit. Sed id felis nibh. Praesent a condimentum quam, in ullamcorper erat. Nulla facilisi. Aliquam non massa quis neque consequat vestibulum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras auctor nunc quam, nec venenatis neque scelerisque eget. Duis ac bibendum arcu. Vivamus porta nulla ut bibendum ullamcorper. Sed lobortis pretium lorem eu lacinia. Fusce auctor venenatis tortor. Nam mattis dui vel ex posuere hendrerit. Cras id lorem ut ante facilisis aliquet."
      },
    ],
    "otherNotes": ""
  }
]

const alphanumericString = 'ABCDEFG'
export const getTheAlphanumericOrder = R.flip(R.nth)(alphanumericString)

export const tags = ["SQL", "React", "JavaScript", "PHP", "NoSQL", "Database", "Algorithms And Data Structure"]
