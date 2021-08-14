import React from "react";
import { GlobalContext } from '../provider/GlobalProvider';
import "../styles/main.css";
import "../styles/header.css";
import Bills from "../images/bills.svg";

class HeaderComponent extends React.Component {

    state = {
    }

    static contextType = GlobalContext;

    componentDidMount = async () => {
    }

    render() {
        return (
            <div className="headerContainer flex column justify-center align-center">
                <div className="headerGroup flex justify-center align-center w-100">
                    <h2>Dividend Tracer</h2>
                    <img alt="logo" className="headerLogo" src={Bills} height={40} />
                </div>
                <div className="presentation">
                    <span>This site will never open your metamask</span>
                </div>

            </div>
        )
    }
}
export default HeaderComponent;
