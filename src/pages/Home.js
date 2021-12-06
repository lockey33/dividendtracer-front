import React from "react";
import styled from "styled-components";
import { Ads } from "../components/Ad/AdWrapper";
import { Tracker } from "../components/Tracker/Tracker";

const Container = styled.div`
    display: block;
    margin: 0 auto;
    padding: 0rem 20px 2rem;
    @media (min-width: 768px) {
        max-width: 1200px;
    }
    @media (min-width: 1200px) {
        max-width: 890px;
        padding: 1rem 20px 2rem;
    }
`

class HomePage extends React.Component {

    render(){
        return (
        <Container>
            {/* <Ads /> */}
            <Tracker history={this.props.history} />
            {/* <Ads /> */}
        </Container>
        );
    }

}

export default HomePage;