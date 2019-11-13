# errorRecord.js

Libray for collect many Error objects and filtered output (console.error) , this module exports `class ErrorRecord`.

## ErrorRecord class (extends Record class)

#### Usage example
```javascript
let ErrorRecord = require('file path to this errorRecord.js');

let errorRecord = new ErrorRecord();

errorRecord.write(new Error('some error'));
errorRecord.write(new Error('some error'));
errorRecord.write(new Error('some error'));
...
// 10000 times error //
errorRecord.write(new Error('some error')); 
...
```

standard error output is like this.

```
Error first times
some error some information ....
Error 2 times : some error
Error 3 times : some error
Error 4 times : some error
Error 5 times : some error
Error 6 times : some error
Error 7 times : some error
Error 8 times : some error
Error 9 times : some error
Error 10 times : some error
Error 100 times : some error
Error 1000 times : some error
Error 10000 times : some error
```

#### Constructor & Method
- constructor
  - no argument
- `write` method
  - argument is Error object
  - return a Promise object (this resolve function return nothing)
