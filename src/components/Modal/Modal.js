import React from "react";
import { ModalHeaderWrapper, ModalInner, ModalWrapper } from "./styled";
import { Form, Input, ItemForm, SubmitButton, Textarea } from "../Tracker/styled";
import {Heading, Flex} from "rebass";
import emailjs from 'emailjs-com';

const ModalHeader = ({title, close}) => {
    return (
        <ModalHeaderWrapper>
            <Heading color="white" fontFamily="DM Sans" fontSize={[4]}>{title}</Heading>
            <button onClick={(e) => close(e)} type="button">
                <span aria-hidden="true">&times;</span>
            </button>
        </ModalHeaderWrapper>
    );
};


export const Modal = ({onClose, title}) => {

    const form = React.useRef();
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [mailSent, setMailSent] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(false);
    const [errorName, setErrorName] = React.useState(false);
    const [errorEmail, setErrorEmail] = React.useState(false);
    const [errorSubject, setErrorSubject] = React.useState(false);
    
    const checkForm = () => {
        if (name !== '' && email !== '' && message !== '' && subject !== '') {
            return true;
        }
        if(name === '') {
            setErrorName(true);
        }
        if(email == ''){
            setErrorEmail(true)
        }
        if(message == ''){
            setErrorMessage(true)
        }
        if(subject ==''){
            setErrorSubject(true)
        }
        if(name == '' && email == '' && message == '' && subject == ''){
            setErrorName(true)
            setErrorEmail(true)
            setErrorSubject(true)
            setErrorMessage(true)
        }
        return false;
    };

    const sendEmail = (e) => {
        e.preventDefault();

        if (checkForm()) {
            console.log('sent')
            // emailjs.sendForm('service_mvixdaj', 'template_rysxfag', form.current, 'user_Fvqr4uQEqPGfs4HBLeijn')
            // .then(() => {
            //     setMailSent(true);
            // }, (error) => {
            //     console.log(error.text);
            // });

            // setTimeout(() => {
            //     setMailSent(false);

            // }, 3000);
        }else{
            console.log('error')
        }
    };

    function close(e){
        e.preventDefault()
        
        if (onClose) {
            onClose()
        }
    }

    return (
        <ModalWrapper>
            <ModalInner>
                <ModalHeader title={title} close={(e) => close(e)} />
                {!mailSent ?
                    <Form ref={form} onSubmit={(e) => sendEmail(e)}>
                        <ItemForm>
                            <Input className={errorName ? 'error' : ''} onChange={(e) => {setErrorName(false); setName(e.target.value)}} type="text" name="name" placeholder="Name"/>
                        </ItemForm>
                        <ItemForm>
                            <Input className={errorEmail ? 'error' : ''} onChange={(e) => {setErrorEmail(false); setEmail(e.target.value)}} type="email" name="email" placeholder="Email"/>
                        </ItemForm>
                        <ItemForm>
                            <Input className={errorSubject ? 'error' : ''} onChange={(e) => {setErrorSubject(false); setSubject(e.target.value)}} type="text" name="subject" placeholder="Subject"/>
                        </ItemForm>
                        <ItemForm>
                            <Textarea className={errorMessage ? 'error' : ''} onChange={(e) => {setErrorMessage(false); setMessage(e.target.value)}} rows={'5'} name="message" placeholder="Message"/>
                        </ItemForm>
                        <SubmitButton type="submit">Send</SubmitButton>
                    </Form>
                    :
                    <Flex justifyContent="center" alignItems="center" flexDirection="column">
                        <Heading color="white" fontFamily="DM Sans" fontSize={[4]}>Thank you for your message!</Heading>
                        <Heading color="white" fontFamily="DM Sans" fontSize={[2]}>We will get back to you as soon as possible.</Heading>
                    </Flex>
                }
            </ModalInner>
        </ModalWrapper>
    )
}