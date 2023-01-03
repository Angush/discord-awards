import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { Button, Modal } from 'react-bootstrap'

const PortalModal = ({
  close,
  title,
  footer,
  buttons,
  subtitle,
  nodeId = 'modal',
  showCloseButton = true,
  children,
  isOpen,
}) => {
  const [show, setShow] = useState(isOpen === undefined ? true : isOpen)
  const hide = () => setShow(false)

  return (
    <>
      {createPortal(
        <Modal
          className='portal-modal'
          centered
          size='lg'
          show={show}
          onHide={hide}
          onExited={close}
        >
          <Modal.Header className='modal-topbar' closeButton>
            <Modal.Title className='modal-heading'>{title}</Modal.Title>
            {subtitle && <div className='modal-subtitle h6'>{subtitle}</div>}
          </Modal.Header>
          <Modal.Body>{children}</Modal.Body>
          <Modal.Footer className='modal-bottombar'>
            {footer && <p className='modal-footer-text'>{footer}</p>}
            {buttons && buttons.map(btn => btn)}
            {showCloseButton && <Button onClick={hide}>Close</Button>}
          </Modal.Footer>
        </Modal>,
        document.getElementById(nodeId)
      )}
    </>
  )
}

export default PortalModal
