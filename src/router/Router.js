import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "../pages/Home";
import { useHistory } from "react-router-dom";

const AppRouter = () => {
    let history = useHistory();
    return (
        <Router>
            <Route props={window.history} default path="/" exact component={Home} />
        </Router>
    )
}

export default AppRouter;
