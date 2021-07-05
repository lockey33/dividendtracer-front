import React from "react";
import { GlobalContext, StateConsumer } from '../provider/GlobalProvider';
import "../styles/main.css";
import "../styles/header.css";

class HeaderComponent extends React.Component {

    state = {
    }

    static contextType = GlobalContext;

    componentDidMount = async () => {
    }

    render() {
        return (
            <div className="headerContainer flex justify-center">
                <h2>CryptoRadar</h2>
            </div>
        )
    }
}
export default HeaderComponent;
