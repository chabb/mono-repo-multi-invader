# MultiInvader

The are three main projects:

* libs
* multiplayer  ( nestjs server)
* tanks ( game client )

## Commands

Start the server
```
nx serve multiplayer
```

Start the client 
``` 
// the nx doc gives this example
nx build tanks 
npx http-server dist/tanks 
// BUT it would be better to use vite server, as it's actually configured
nx serve tanks
// you will have the source map that way
 ```
Build a lib (e.g: collision )
``` 
nx build collision
```
