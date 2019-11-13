# csv.js

Libray for creating and writing (adding) some data to csv file, this module exports `class Csv`.

## Csv class (extends Record class)

#### Usage example
```javascript
let Csv = require('file path to this csv.js');

let csv = new Csv({
    path: 'result.csv',
    order: ,
    date: ,
    dateFormat: 
});

csv.write({a: 1, b: 2});
csv.write({a: 3, b: 4});
csv.write({a: 5, b: 6});
```

Finally `result.csv` is like this.
```
a,b
1,2
3,4
5,6
```

#### Constructor & Method
- constructor
  - argument is one object
  ```
  {
    path: string
    order: [string]  
    date: bool
    dateFormat: string  (option)
  }
  ```  
`path` is a path to output csv file.
`order` is an array of object (write method argument) keys.
`date` is 
`dateFormat`

- `write` method
  - argument is one object
  
  ```
  {
    key0: any
    key1: any
    key2: any
    ...
  }
  ```  
    
  - return a Promise object (this resolve function return nothing)

