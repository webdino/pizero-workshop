# record.js

Libray as parent class for csv.js, machinist.js, ambient.js, error.js, this module exports `class Record`.

## Record class

#### Usage example
required from another class, and extended
```javascript
let Record = require('file path to this record.js');

class Sample extends Record{
    constructor(){
        super();
    }
    ...
}
```

#### Constructor & Method
- constructor
  - no arguments
- `write` method
  - no arguments
  - return a Promise object (this resolve function return nothing)
