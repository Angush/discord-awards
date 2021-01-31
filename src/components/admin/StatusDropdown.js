import React from 'react'
import { Dropdown } from 'react-bootstrap'

const SVGs = {
  approve: (<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" className="svg-inline--fa fa-check-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>),
  reject: (<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" className="svg-inline--fa fa-times-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg>),
  reset: (<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="question-circle" className="svg-inline--fa fa-question-circle fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>)
}

const options = ['reset', 'approve', 'reject']

const getCurrentStatus = status => {
  if (status === 1) return [options[1], '✔']
  if (status < 0) return [options[2], '❌']
  return [options[0], '❔']
}

const StatusDropdown = ({ id, catId, status, select, size = "sm", classes = '' }) => {
  const [current] = getCurrentStatus(status)
  const includedOptions = options.filter(option => option !== current)
  const idPacket = { id, catId }

  return (
    <Dropdown size={size} className={`status-dropdown status-${current} ${classes}`}>
      <Dropdown.Toggle>
        {SVGs[current]}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {includedOptions.map(option => {
          if (option === "approve") return (
            <Dropdown.Item key="approve" onClick={() => select(idPacket, "approve")} className='option-approve'>
              <span>{SVGs.approve}</span> Mark Approved
            </Dropdown.Item>
          )

          if (option === "reject") return (
            <Dropdown.Item key="reject" onClick={() => select(idPacket, "reject")} className='option-reject'>
              <span>{SVGs.reject}</span> Mark Rejected
            </Dropdown.Item>
          )
          
          return (
            <Dropdown.Item key="reset" onClick={() => select(idPacket, "reset")} className='option-reset'>
              <span>{SVGs.reset}</span> Mark Unvetted
            </Dropdown.Item>
          )
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default StatusDropdown