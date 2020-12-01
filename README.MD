# throttler-api :hamster:

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

We often have to impose limits on something. Throttler pics up this problem. All the other service needs to do is to make http query.

```sh
POST http://localhost:3000/throttler/api/event
{
    events: {
       "pastebin.com/prod/users/kotichka": {
          points: 900000
          throttlers:[
           { max: 1000000, kind: "points"  },
           { max: 10000000, kind: "points", per: "1d"  },
           { max: 5, kind: "count", per: "1h"  },
           { max: 100, kind: "count", per: "1d"  },
          ]
       },
       "pastebin.com/prod/categories/free-users": {
          points: 900000     
          throttlers:[
           { max: 10000000000, kind: "points", per: "1d"  },
           { max: 5000, kind: "count", per: "1h"  },
          ]
       }
    }
}
```

You response will be
```sh
{
    allow: false,
    data: {
       "pastebin.com/prod/users/rshmelev": {  <- я называю это "категория"
          allow:[
           true,
           false,
           false,
           true, 
          ],
          reason: "> 10000000 points per 1d, > 5 events per 1h"
       },
       "pastebin.com/prod/categories/free-users": { 
          allow:[
           true,
           true,
          ]
       }
    },
}
```

All what you need to start it:
 - make .env file(you can find example in main directory)
```sh
    npm i
    npm start
```

***Free Software, Hell Yeah!*** :sheep: