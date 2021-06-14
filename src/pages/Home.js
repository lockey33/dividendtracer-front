import React from "react";
import { GlobalContext, StateConsumer } from '../provider/GlobalProvider';
import ListenerFactory from "../../../factory/listenerFactory";

class Home extends React.Component {

    state = {
    }

    static contextType = GlobalContext;

    componentDidMount = async () => {
        const listener = new ListenerFactory()
        listener.pendingTransaction(mainNetSocket)
    }

    render() {
        return (
            <div>
                <h3>Front</h3>
            </div>
        )
    }
}
export default Home;
