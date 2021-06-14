import React, { Component, useContext } from "react";
import axios from 'axios';
import moment from 'moment';


const GlobalContext = React.createContext({});

class GlobalProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

        this.actions = {

        }
    }

    componentDidMount = async () => {

    }

    render() {
        return (
            <GlobalContext.Provider value={{ global : {state: this.state, actions: this.actions}}}>
                {this.props.children}
            </GlobalContext.Provider>
        )
    }
}

export { GlobalProvider as default, GlobalContext }
