# Raudhah Pay Client Library using Node

It is simple wrapper class written in php to ease use of RaudhahPay Payment Gateway

## Installation

Using NPM

```npm install raudhahpay --save```

Using Yarn

```yarn add raudhahpay```

## Example

```
const raudhahpay = require('raudhahpay')

// Setup your configs
const config = {
  api_key: '<your-api-key>',
  signature_key: '<your-signature-key>',
  isSandbox: true
}

// Initialize 
const app = raudhahpay(config)

// Create collection
app.createCollection('your collection name')
  .then(res => {
    // This is your result
    console.log(res.data)
  })
  .catch(err => {
    // This is your error message
    console.log(err.message)
  })

// Create bill
const billData = {
  collectionCode: '<your-collection-code>',
  customer: {
    first_name: 'First Name',
    last_name: 'Last Name',
    address: 'Address',
    email: 'example@example.com',
    mobile: '60123456789'
  },
  reference: 'your reference',
  products: [
    {
      title: 'Product A',
      price: '10.50',
      quantity: '1'
    },
    ... // can add more products
  ]
}

app.createBill(billData)
  .then(res => {
    // This is your result
    console.log(res.data)
  })
  .catch(err => {
    // This is your error message
    console.log(err.message)
  })


// Validating Webhook
const examplePayload = {
  amount: '10.50',
  bill_id: '1111',
  bill_no: 'PW7O1XHI',
  currency: 'MYR',
  paid: '1',
  payment_method: 'Online Banking',
  ref1: 'abc',
  ref2: '',
  ref_id: 'PW7O1XHI__20210217142403',
  status: '4',
  signature: '495f64ec9aa9c8c585d27961bd8b8905f14f3abbadd05d0ccca4913159818e0b'
}

const checksumStatus = app.isChecksumValid(examplePayload)

// if your checksumStatus === true, it's good to go.