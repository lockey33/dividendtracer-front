import React from "react";
import styled from "styled-components";
import { Ads } from "../components/Ad/AdWrapper";
import { Tracker } from "../components/Tracker/Tracker";

const Container = styled.div`
    display: block;
    margin: 0 auto;
    padding: 0rem 20px;
    @media (min-width: 768px) {
        max-width: 1200px;
    }
    @media (min-width: 1200px) {
        max-width: 890px;
        padding:3rem 20px;
    }
`

class HomePage extends React.Component {

    render(){
        return (
        <Container>
            <Ads />
            <Tracker />
            <Ads />
        </Container>
        );
    }

}

export default HomePage;