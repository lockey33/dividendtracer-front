import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../components/Header/Header";
import ResultsPage from "../pages/Results";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TrendingsMarquee } from "../components/Trendings/TrendingsMarquee";
import { Modal } from "../components/Modal/Modal";
import {Flex, Text} from "rebass";
import { TelegramButton } from "../components/Header/styled";
import { FaTelegramPlane } from "react-icons/fa";

const AppRouter = () => {

    return (
        <Router>
            <ToastContainer theme='dark' />
            <TrendingsMarquee />
            <Header />
            <Route props={window.history} default path="/" exact component={Home} />
            <Route path="/results" component={ResultsPage} />
            <ModalAnnouncement />
        </Router>
    )
}

const ModalAnnouncement = () => {

    const [isModalOpen, setIsModalopen] = useState(false);
    const modalViewed = React.useMemo(() => {return localStorage.getItem('modalViewed')}, []);

    const closeModal = () => {
        setIsModalopen(false);
        localStorage.setItem('modalViewed', true);
    }

    useEffect(() => {
        setTimeout(() => {
            if(!modalViewed){
                setIsModalopen(true);
                return;
            }
        }, 20000);
    }, [])

    return(
        <Modal isOpen={isModalOpen} title={'📢 If we say Tokenomics...'} onClose={closeModal}>
            <Flex flexDirection="column" alignItems="center">
                <Text color="white" mb={2} fontWeight={'bold'} textAlign="center" fontSize={[2, 3]}>🤑 Get a chance to join our presale whitelist</Text>
                <Text color="white" mb={4} textAlign="center" fontStyle="italic" fontSize={1}>Not already a part of the DividendTracer's community ?</Text>
                <TelegramButton noMobile rel="noreferrer" target="_blank" href="https://t.me/DividendTracer">Join our telegram <FaTelegramPlane color="white" /></TelegramButton>
            </Flex>
        </Modal>
    )

}

export default AppRouter;
