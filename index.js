const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = process.env.PORT

app.set('view engine', 'ejs')

const Twit = require('twit')
const T = new Twit({
    consumer_key: process.env.CONSUMER_KEY ,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60*1000
})

const stream = T.stream('statuses/filter', { track: '#COVID19', language: 'pt'})
stream.on('tweet', tweet => {
    console.log(tweet.user.name, tweet.text)
    io.emit('tweet', {
        username: tweet.user.name,
        text: tweet.text
    })
})


app.get('/', (req, res) => {
    res.render('home')
})


http.listen(port, err => {
    if(err){
        console.log(err)
    }else{
        console.log('running...')
    }
})