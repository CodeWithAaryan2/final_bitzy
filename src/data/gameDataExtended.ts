import type { QuizQuestion } from '@/components/games/QuizGame';

// Memory Match cards - programming concepts
export const memoryCards = [
  { id: 'mm1', term: 'Variable', definition: 'A named container for storing data values' },
  { id: 'mm2', term: 'Function', definition: 'A reusable block of code that performs a task' },
  { id: 'mm3', term: 'Array', definition: 'An ordered collection of items stored together' },
  { id: 'mm4', term: 'Loop', definition: 'Code that repeats until a condition is met' },
  { id: 'mm5', term: 'Boolean', definition: 'A data type with only true or false values' },
  { id: 'mm6', term: 'String', definition: 'A sequence of characters representing text' },
  { id: 'mm7', term: 'API', definition: 'Interface that allows different software to communicate' },
  { id: 'mm8', term: 'DOM', definition: 'Document Object Model - tree structure of HTML' },
  { id: 'mm9', term: 'Git', definition: 'Version control system for tracking code changes' },
  { id: 'mm10', term: 'SQL', definition: 'Language for managing and querying databases' },
  { id: 'mm11', term: 'CSS', definition: 'Language for styling and laying out web pages' },
  { id: 'mm12', term: 'HTTP', definition: 'Protocol for transferring data over the web' },
];

// Code Prediction questions
export const predictionQuestions = [
  {
    id: 'cp1', code: 'let x = 5;\nlet y = "5";\nconsole.log(x + y);', language: 'javascript',
    options: ['10', '"55"', '55', 'NaN'], correctIndex: 1,
    explanation: 'When adding a number and string, JS converts the number to string: "5" + "5" = "55"',
  },
  {
    id: 'cp2', code: 'const arr = [1, 2, 3];\nconst result = arr.map(x => x * 2);\nconsole.log(result);', language: 'javascript',
    options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'undefined'], correctIndex: 1,
    explanation: 'map() creates a new array by applying a function to each element: [1*2, 2*2, 3*2] = [2, 4, 6]',
  },
  {
    id: 'cp3', code: 'let count = 0;\nfor (let i = 0; i < 5; i++) {\n  count += i;\n}\nconsole.log(count);', language: 'javascript',
    options: ['5', '10', '15', '0'], correctIndex: 1,
    explanation: '0+1+2+3+4 = 10 - the loop adds each value of i to count',
  },
  {
    id: 'cp4', code: 'const obj = { a: 1, b: 2 };\nconst { a, b } = obj;\nconsole.log(a + b);', language: 'javascript',
    options: ['12', '3', 'undefined', '{a:1, b:2}'], correctIndex: 1,
    explanation: 'Destructuring extracts a=1 and b=2, so 1+2 = 3',
  },
  {
    id: 'cp5', code: 'console.log(typeof []);', language: 'javascript',
    options: ['"array"', '"object"', '"list"', '"undefined"'], correctIndex: 1,
    explanation: 'In JavaScript, arrays are technically objects. Use Array.isArray() to check for arrays.',
  },
  {
    id: 'cp6', code: 'def f(n):\n    if n <= 1:\n        return n\n    return f(n-1) + f(n-2)\nprint(f(6))', language: 'python',
    options: ['6', '8', '13', '21'], correctIndex: 1,
    explanation: 'Fibonacci sequence: 0,1,1,2,3,5,8 - f(6) returns 8',
  },
  {
    id: 'cp7', code: 'x = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))', language: 'python',
    options: ['3', '4', 'Error', 'None'], correctIndex: 1,
    explanation: 'y is a reference to the same list as x, so appending to y also changes x. len([1,2,3,4]) = 4',
  },
  {
    id: 'cp8', code: 'nums = [1, 2, 3, 4, 5]\nprint(nums[1:4])', language: 'python',
    options: ['[1, 2, 3]', '[2, 3, 4]', '[2, 3, 4, 5]', '[1, 2, 3, 4]'], correctIndex: 1,
    explanation: 'Slice [1:4] includes indices 1, 2, 3 (not 4), giving [2, 3, 4]',
  },
];

// Fill in the Blank questions
export const fillBlankQuestions = [
  {
    id: 'fb1', code: 'function greet(name) {\n  return `Hello, ______!`;\n}\ngreet("World");', language: 'javascript',
    blanks: [{ position: 37, answer: '${name}', hint: 'template literal' }], points: 100,
  },
  {
    id: 'fb2', code: 'const doubled = numbers.______(x => x * 2);', language: 'javascript',
    blanks: [{ position: 22, answer: 'map', hint: 'array method' }], points: 100,
  },
  {
    id: 'fb3', code: 'for (let i = 0; i < arr.length; ______) {\n  console.log(arr[i]);\n}', language: 'javascript',
    blanks: [{ position: 33, answer: 'i++', hint: 'increment' }], points: 100,
  },
  {
    id: 'fb4', code: 'import { useState } from "______";', language: 'javascript',
    blanks: [{ position: 26, answer: 'react', hint: 'library name' }], points: 100,
  },
  {
    id: 'fb5', code: 'const [count, ______] = useState(0);', language: 'javascript',
    blanks: [{ position: 15, answer: 'setCount', hint: 'setter function' }], points: 100,
  },
  {
    id: 'fb6', code: 'def factorial(n):\n    if n <= 1:\n        return ______\n    return n * factorial(n - 1)', language: 'python',
    blanks: [{ position: 46, answer: '1', hint: 'base case' }], points: 100,
  },
  {
    id: 'fb7', code: 'squares = [x**2 for x in range(______)]', language: 'python',
    blanks: [{ position: 35, answer: '5', hint: ' generates 0-4' }], points: 100,
  },
  {
    id: 'fb8', code: '.container {\n  display: ______;\n  justify-content: center;\n}', language: 'css',
    blanks: [{ position: 18, answer: 'flex', hint: 'layout mode' }], points: 100,
  },
  {
    id: 'fb9', code: '<button on______={handleClick}>Click</button>', language: 'jsx',
    blanks: [{ position: 13, answer: 'Click', hint: 'event handler' }], points: 100,
  },
  {
    id: 'fb10', code: 'fetch(url)\n  .then(res => res.______())\n  .then(data => console.log(data));', language: 'javascript',
    blanks: [{ position: 33, answer: 'json', hint: 'parse method' }], points: 100,
  },
];

// Extended quiz questions
export const pythonQuizQuestions: QuizQuestion[] = [
  {
    id: 'pyq1', question: 'What is the output of len([1, 2, 3])?', options: ['2', '3', '4', 'Error'],
    correctIndex: 1, explanation: 'len() returns the number of items: [1,2,3] has 3 items.', difficulty: 'easy',
  },
  {
    id: 'pyq2', question: 'Which keyword defines a function in Python?', options: ['func', 'def', 'function', 'define'],
    correctIndex: 1, explanation: 'def is used to define functions in Python.', difficulty: 'easy',
  },
  {
    id: 'pyq3', question: 'What does list comprehension [x for x in range(5)] create?', options: ['[1,2,3,4,5]', '[0,1,2,3,4]', '[0,1,2,3,4,5]', '[1,2,3,4]'],
    correctIndex: 1, explanation: 'range(5) generates 0,1,2,3,4. List comprehension collects them into a list.', difficulty: 'easy',
  },
  {
    id: 'pyq4', question: 'What is __init__ in a Python class?', options: ['A destructor', 'A constructor', 'A module', 'A decorator'],
    correctIndex: 1, explanation: '__init__ is the constructor method called when creating a new object.', difficulty: 'medium',
  },
  {
    id: 'pyq5', question: 'What is the difference between tuple and list?', options: ['Tuples are mutable', 'Lists are ordered', 'Tuples are immutable', 'Lists are faster'],
    correctIndex: 2, explanation: 'Tuples cannot be changed after creation (immutable), while lists can (mutable).', difficulty: 'medium',
  },
];

export const reactQuizQuestions: QuizQuestion[] = [
  {
    id: 'rq1', question: 'What does JSX stand for?', options: ['JavaScript XML', 'Java Syntax Extension', 'JSON XML', 'JavaScript Extension'],
    correctIndex: 0, explanation: 'JSX = JavaScript XML. It is a syntax extension for JavaScript.', difficulty: 'easy',
  },
  {
    id: 'rq2', question: 'Which hook manages state in functional components?', options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctIndex: 1, explanation: 'useState is the primary hook for adding state to function components.', difficulty: 'easy',
  },
  {
    id: 'rq3', question: 'What is the purpose of useEffect?', options: ['State management', 'Side effects', 'Routing', 'Styling'],
    correctIndex: 1, explanation: 'useEffect handles side effects like data fetching, subscriptions, DOM updates.', difficulty: 'easy',
  },
  {
    id: 'rq4', question: 'What are props in React?', options: ['Internal state', 'Passed-down data', 'Style rules', 'Event handlers'],
    correctIndex: 1, explanation: 'Props are data passed from parent to child components. They are read-only.', difficulty: 'easy',
  },
  {
    id: 'rq5', question: 'What is the Virtual DOM?', options: ['A real DOM copy', 'A lightweight DOM representation', 'A browser feature', 'A CSS framework'],
    correctIndex: 1, explanation: 'Virtual DOM is a lightweight in-memory representation that React uses to optimize updates.', difficulty: 'medium',
  },
];

export const cppQuizQuestions: QuizQuestion[] = [
  {
    id: 'cppq1', question: 'What does cout << do in C++?', options: ['Input', 'Output', 'Error', 'Nothing'],
    correctIndex: 1, explanation: 'cout << is used for output to the console in C++.', difficulty: 'easy',
  },
  {
    id: 'cppq2', question: 'Which symbol declares a pointer?', options: ['&', '*', '#', '@'],
    correctIndex: 1, explanation: 'The asterisk * declares a pointer variable in C++.', difficulty: 'easy',
  },
  {
    id: 'cppq3', question: 'What is a constructor?', options: ['A destructor', 'An object creator', 'A function call', 'A loop'],
    correctIndex: 1, explanation: 'A constructor is a special method called when an object is created.', difficulty: 'medium',
  },
  {
    id: 'cppq4', question: 'What is the STL?', options: ['Standard Template Library', 'Simple Type List', 'Static Type Loader', 'System Template Loader'],
    correctIndex: 0, explanation: 'STL = Standard Template Library. It provides containers, algorithms, and iterators.', difficulty: 'medium',
  },
  {
    id: 'cppq5', question: 'What does the new keyword do?', options: ['Deletes memory', 'Allocates heap memory', 'Creates a variable', 'Returns a value'],
    correctIndex: 1, explanation: 'new allocates memory on the heap and returns a pointer to it.', difficulty: 'medium',
  },
];
