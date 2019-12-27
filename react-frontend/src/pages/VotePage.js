import React from 'react'
// import Contest from '../components/Contest'
// import axios from 'axios'
import { Link } from '@reach/router'

const VotePage = ({ userData }) => {
  return (
    <div>
      <h1>Voting is not yet open!</h1>
      <p>
        Go to <Link to='nominate'>the nomination page</Link> to nominate
        something in one of our <Link to='categories'>many categories</Link>!
      </p>
    </div>
  )
  // const [data, setData] = useState({})

  // useEffect(() => {
  //   axios.get(`http://10.0.0.65:3001/api/`)
  //   .then(res => {
  //     let rawData = res.data
  //     rawData.nominations.forEach(nomination => {
  //       nomination.contests.forEach(contest => {
  //         contest.voted = contest.votes.includes(userData.id)
  //         contest.votes = contest.votes.length
  //       })
  //     })
  //     setData(rawData)
  //   })
  // }, [userData])

  // const toggleVote = (contestID, nominationID) => {
  //   if (!userData.id || !data.nominations) return
  //   axios.post(`http://10.0.0.65:3001/api/vote_toggle/${userData.id}/${nominationID}/${contestID}`)
  //   .then(res => {
  //     console.log(data.nominations[nominationID])
  //     let contest = data.nominations[nominationID].contests[contestID]
  //     if (contest.voted) {
  //       contest.voted = false
  //       contest.votes--
  //     } else {
  //       contest.voted = true
  //       contest.votes++
  //     }
  //     let updated = {...data}
  //     updated.nominations[nominationID].contests[contestID] = contest
  //     setData(updated)
  //   })
  // }

  // return (
  //   <div id="content">
  //     {!data.contests
  //       ? <div id="load_indicator">Loading...</div>
  //       : <div id="contests">
  //         {data.contests.map(contest =>
  //           <Contest contest={contest} nominations={data.nominations} toggleVote={toggleVote} />
  //         )}
  //       </div>
  //     }
  //   </div>
  // )
}

export default VotePage
