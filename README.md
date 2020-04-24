## badatnames
I made this repo to have a place to fool around with React/Redux & whatever else I want

The initial page is kind of a directory of sorts, but only 'Paint' (a skribbl.io clone) currently is set up with anything substantial

### Paint
A Skribbl.io clone made with React/Redux on the front-end & express/Socket.io on the server side
To run it (need two terminal instances, one for react & one for express):
`npm start`
`node websocket`

### Pong
'Pong' has some work in it, but I wasn't having too much fun duplicating game code for the authoritative server (couldn't directly copy it due to client code being in react & server code being just a js file, so I didn't feel like fleshing it out due to it being tedious)

To run this uncomment the line near the bottom of websocket.js `//setupAuthoritativePhaser();`, then run the two commands
`npm start`
`node websocket`
