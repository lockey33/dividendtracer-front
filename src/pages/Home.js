import React from "react";
import { useHistory } from "react-router";
import { Tracker } from "../components/Tracker/Tracker";
import { Container } from "./styled";

const HomePage = () =>{
    const history = useHistory();
    return (
        <Container>
            <Tracker history={history} />
        </Container>
    );

}

export default HomePage;