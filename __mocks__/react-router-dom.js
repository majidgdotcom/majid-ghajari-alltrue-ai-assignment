// Root-level mock for react-router-dom.
// Jest automatically uses __mocks__/ (next to node_modules) for node_module mocks.
// This sidesteps the ESM-only issue with react-router-dom v7 + CRA's Jest config.
const React = require("react");

const BrowserRouter = ({ children }) => React.createElement(React.Fragment, null, children);
const Routes = ({ children }) => React.createElement(React.Fragment, null, children);
const Route = ({ element }) => React.createElement(React.Fragment, null, element);
const Link = ({ children, to }) => React.createElement("a", { href: to }, children);
const useNavigate = () => jest.fn();
const useLocation = () => ({ pathname: "/" });
const useParams = () => ({});

module.exports = { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams };
