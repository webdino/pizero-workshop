# sensor.js

Libray as parent class for omron2jcieBu01.js, this module exports `class Sensor`.

## Sensor class

#### Usage example
required from another class, and extended
```javascript
let Sensor = require('file path to this sensor.js');

class Sample extends Sensor{
    constructor(){
        super();
    }
    ...
}
```

#### Constructor & Method
- constructor
  - no arguments
- `read` method
  - no arguments
  - return a Promise object (this resolve function return nothing)
