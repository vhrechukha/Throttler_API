# throttler-api :hamster:

![create with](https://img.shields.io/badge/create%20with-%F0%9F%92%96-ff69b4)
![shpp++](https://img.shields.io/badge/shpp%2B%2B-%F0%9F%92%96-00964b)

I implement this api by [shpp++](https://programming.org.ua/ua) specification.

We often have to impose limits on something. Throttler pics up this problem. All the other service needs to do is to make http query. **BE AWARE THIS API CAN MISS MORE DATA!**
```sh
POST http://localhost:3000/throttler/api/event
{
  "events": {
    "pastebin.com/prod/users/kotichka": {
      "points": 900000,
      "throttlers": [
        {
          "max": 1000000,
          "kind": "points"
        },
        {
          "max": 10000000,
          "kind": "points",
          "per": "1d"
        },
        {
          "max": 5,
          "kind": "count",
          "per": "1h"
        },
        {
          "max": 100,
          "kind": "count",
          "per": "1d"
        }
      ]
    },
    "pastebin.com/prod/categories/free-cats": {
      "points": 900000,
      "throttlers": [
        {
          "max": 10000000000,
          "kind": "points",
          "per": "1d"
        },
        {
          "max": 5000,
          "kind": "count",
          "per": "1h"
        }
      ]
    }
  }
}```

Commands:
```sh
    npm i
    npm start
    npm test
```

***Free Software, Hell Yeah!*** :sheep:
