let fs = require('fs')
let axios = require('axios')
let btoa = require('btoa')
let express = require('express')
let cors = require('cors')
let app = express()
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const GUILD_ID = process.env.GUILD_ID
const redirect = encodeURIComponent(`http://localhost:3001/authenticated`)


// const session = require('express-session')
// const passport = require('passport')
// const DiscordStrategy = require('passport-discord').Strategy
// const scopes = ['identify', 'guilds']

// passport.use(new DiscordStrategy({
//   clientID: CLIENT_ID,
//   clientSecret: CLIENT_SECRET,
//   callbackURL: `http://localhost:3001/authenticated`,
//   scope: scopes
// }, (accessToken, refreshToken, profile, callback) => {
//   process.nextTick(() => {
//     return callback(null, profile)
//   })
// }))

// app.use(session({
//   secret: "app secret here oooo",
//   resave: false,
//   saveUninitialized: false
// }))

// app.use(passport.initialize())
// app.use(passport.session())




app.use(cors({
  credentials: true
}))

// let config = {
//   user: "cauldron2018",
//   password: "F9xnOP0pXCMSy8f2",
//   server: "syl.ae",
//   database: "cauldron2018",
// }
// const sql = require('mssql')
// const pool = new sql.ConnectionPool(config).connect()

// let populateCollections = async () => {
//   await pool
//   try {
//     const request = pool.request()
//     AwardsClient.nominations = await request.query`select * from nominations`
//     console.dir(AwardsClient.nominations)
//   } catch (err) {
//     console.log(`${new Date()} - Failed to populate collections!`)
//     console.error(err)
//     sql.close()
//     setTimeout(() => {
//       populateCollections()
//     }, 1000 * 10)
//   }
// }
// populateCollections()

let AwardsClient = JSON.parse(fs.readFileSync('./data.json'))

app.get('/api', (req, res) => {
  console.log(`${new Date().toUTCString()} - GET request @ /api`)
  res.status(200).send(JSON.stringify(AwardsClient))
})

app.get('/api/nominations', (req, res) => {
  console.log(`${new Date().toUTCString()} - GET request @ /api/nominations`)
  let nominations = AwardsClient.nominations
  nominations.forEach(nomination => {
    nomination.contests.forEach(contest => {
      contest.voteCount = contest.votes.length
    })
  })
  res.status(200).send(JSON.stringify(AwardsClient.nominations))
})

app.get('/api/contests', (req, res) => {
  console.log(`${new Date().toUTCString()} - GET request @ /api/contests`)
  res.status(200).send(JSON.stringify(AwardsClient.contests))
})

app.get('/api/votes', (req, res) => {
  console.log(`${new Date().toUTCString()} - GET request @ /api/votes`)
  let votes = {}
  AwardsClient.nominations.forEach(nomination => {
    nomination.contests.filter(contest => contest.votes.length > 0).forEach(contest => {
      contest.votes.forEach(userID => {
        let nominationID = AwardsClient.nominations.indexOf(nomination)
        if (!votes[userID]) votes[userID] = []

        let voteEntry = votes[userID].find(vote => contest.id === vote.contestID)
        let index = votes[userID].indexOf(voteEntry)
        if (index === -1) {
          votes[userID].push({
            "contestID": contest.id,
            "nominationIDs": [nominationID]
          })
        } else {
          votes[userID][index].nominationIDs.push(nominationID)
        }
      })
    })
  })
  res.status(200).send(JSON.stringify(votes))
})

// app.post('/api/nominate/:contestID/:entryID', (req, res) => {
  
// })

app.post('/api/vote_toggle/:userID/:nominationID/:contestID', (req, res) => {
  console.log(`${new Date().toUTCString()} - POST request @ /api/vote_toggle`)
  console.log(`                                ${JSON.stringify(req.params)}`)

  let userID = req.params.userID
  let nominationID = req.params.nominationID
  let contestID = req.params.contestID
  if (!userID || !contestID || !nominationID) return res.status(400)
  
  let contest = AwardsClient.contests[contestID]
  let nomination = AwardsClient.nominations[nominationID]
  if (!contest || !nomination) return res.status(400)

  // let existingVotes = nomination.contests.find(c => c.id === contestID)
  // let index = nomination.contests.indexOf(existingVotes)
  // if (existingVotes) {
  //   if (existingVotes.votes.includes(userID)) {
  //     existingVotes
  //   } else {

  //   }
  // } else {

  // }
  
  res.sendStatus(200)
})


/*
 * ************************************
 * Login and authentication stuff below
 * ************************************
*/

app.get('/login', (req, res) => {
  console.log(`${new Date().toUTCString()} - GET request @ /login`)
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify+guilds&response_type=code&redirect_uri=${redirect}`)
})

app.get('/authenticated', (req, res) => {
  console.log(`${new Date().toUTCString()} - GET request @ /authenticated`)
  if (!req.query.code) throw new Error('NoCodeProvided')
  const code = req.query.code
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
  console.log(`                                Auth code: ${code}`)
  axios({
    method: `post`,
    url: `https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    headers: { Authorization: `Basic ${creds}` }
  }).then(async tokenResponse => {
    console.log(`${new Date().toUTCString()} - Token received: ${tokenResponse.data.access_token}`)
    
    let userResponse = await axios({
      method: `get`,
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      url: `https://discordapp.com/api/users/@me`
    })
    console.log(`${new Date().toUTCString()} - User identity data received!`)

    let guildsResponse = await axios({
      method: `get`,
      headers: { Authorization: `Bearer ${tokenResponse.data.access_token}` },
      url: `https://discordapp.com/api/users/@me/guilds`
    })
    console.log(`${new Date().toUTCString()} - User guild data received!`)
    
    let userData = {...userResponse.data}
    userData.is_cauldron_member = guildsResponse.data.filter(g => g.id === GUILD_ID).length === 1
    userData.avatar = `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png?size=128`
    
    res.cookie('discord_data', JSON.stringify(userData), {
      // secure: true,
      // httpOnly: true,
      // sameSite: true
    })
    res.redirect('http://localhost:3000')
    // ! For this, perhaps redirect to http://localhost:3000/ or whatever the frontend app is?
    // * Just gotta find some way to pass the "userData" along to it. http://localhost:3000/?username=Angush won't work, even if it's hidden from the browser bar, because if it takes it from the URL then people can spoof anyone if they have that data.
    // * Once it's being successfully (and securely) passed along, the frontend just needs to parse it and do a setUserData(x) in the useEffect() initialization thing (before making the axios request to the api for the nomination data).
    // * Also gotta save it to cookies (or some other local storage) so that you don't have to log in every time you visit the page. (Maybe the data can be added to cookies directly from backend, and then accessed there by the frontend, and that's how we pass it along?)
    // ! Then, the login button on the frontend can just open the login endpoint on the backend.

  }).catch(console.error)
})

let server = app.listen(3001, () => {
  console.log(`Server running at http://localhost:3001/`)
})