import React from "react";
import ReactDOM from "react-dom";
import { CSSTransition } from "react-transition-group";

import "./Modal.css";
import Backdrop from "./Backdrop";

const ModalOverlay = props => {
    const content = (
        <div className={`modal ${props.className}`}>
                <header className={`modal-header ${props.headerClass}`}>
                    {props.header}
                </header>
                <div className={`modal__content ${props.contentClass}`}>
                    {props.children}
                </div>
                <footer className={`modal-footer ${props.footerClass}`}>
                    {props.footer}
                </footer>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
}

const Modal = props => {
    return (
        <React.Fragment>
            {props.show && <Backdrop onClick={props.onClose} />}
            <CSSTransition
                in={props.show}
                mountOnEnter
                unmountOnExit
                timeout={200}
                classNames="modal slide-in-top"
            >
                <ModalOverlay {...props}/>
            </CSSTransition>
        </React.Fragment>
    );
}

export default Modal;