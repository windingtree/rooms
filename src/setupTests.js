// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'


//some tests which require real browser may fail and need to be either mocked or disabled
//NODE_ENV=test will be a flag that we are running in a "test mode"
process.NODE_ENV='test'