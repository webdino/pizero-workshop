# omron2jcieBu01.js

Libray for using [OMRON 2JCIE BU01](https://www.omron.co.jp/ecb/product-detail?partNumber=2JCIE-BL), this module exports `class Omron2jcieBu01`.

## Omron2jcieBu01 class (extends Sensor class)

#### Usage example
```javascript
let Omron2jcieBu01 = require('file path to this omron2jcieBu01.js');

let omron2jcieBu01 = new Omron2jcieBu01({
    name: "Rbt",
    address: "XXXXXXXXXXXX"
});

let data = await omron2jcieBu01.read();
```

data is like this.

```javascript
{
    "companyId":725,
    "dataType":1,
    "sequenceNo":30,
    "temperature":20.17,
    "relativeHumidity":78.85,
    "ambientLight":19,
    "barometricPressure":1022.865,
    "soundNoise":35.16,
    "eTVOC":0,
    "eCO2":403,
    "reserveForFutureUse":255
    }
```

#### Constructor & Method
- constructor
  - argument is one object
  ```
  {
    name: string,
    address: string
  }
  ```  

- `read` method
  - argument is nothing
  - return a Promise object (this resolve function return object)

