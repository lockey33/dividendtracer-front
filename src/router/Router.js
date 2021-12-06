import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../components/Header/Header";
import ResultsPage from "../pages/Results";

const AppRouter = () => {
    return (
        <Router>
            <Header />
            <Route props={window.history} default path="/" exact component={Home} />
            <Route props={window.history} path="/results" component={ResultsPage} />
        </Router>
    )
}

export default AppRouter;
