/* eslint-disable max-lines-per-function */
const axios = require('axios').default
const crypto = require('crypto')
const lodashMap = require('lodash/map')
const moment = require('moment')
/**
 *
 * @param {Object} config
 */
const init = (config) => {
  config = {
    ...config,
    ...config.isSandbox || { isSandbox: false }
  }

  config.baseUrl = (config.isSandbox) ? 'https://stg-api.raudhahpay.com/api' : 'https://api.raudhahpay.com/api'

  const api = () => axios.create({
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      authorization: `Bearer ${config.api_key}`
    }
  })

  return {
    createCollection: async (collectionName) => {
      try {
        return await api().post(config.baseUrl + '/collections', {
          name: collectionName
        })
      } catch (error) {
        throw new Error(error.response.data.message)
      }
    },

    createBill: async (data) => {
      try {
        const body = {
          due: moment().add(1, 'days').format('YYYY-MM-DD'),
          currency: 'MYR',
          ref1: data.reference,
          ref2: '',
          customer: data.customer,
          product: data.products
        }
        return await api()
          .post(config.baseUrl + `/collections/${data.collectionCode}/bills?include=product-collections.product`, body)
      } catch (error) {
        throw new Error(error.response.data.message)
      }
    },

    isChecksumValid: (payload) => {
      const checksum = payload.signature
      const sortedPayload = sortObject(payload)

      delete sortedPayload.signature

      const a = lodashMap(sortedPayload, (val, key) => {
        return `${key}:${val}`
      })

      const token = crypto.createHmac('sha256', config.signature_key).update(a.join('|')).digest().toString('hex')

      return checksum === token
    }
  }
}

const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})

module.exports = init
