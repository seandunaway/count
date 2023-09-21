#!/usr/bin/env node

import {readFile, writeFile} from 'node:fs/promises'
import {homedir} from 'node:os'
import {parseArgs} from 'node:util'

let {values: args} = parseArgs({
    options: {
        label: {short: 'l', type: 'string', default: 'default'},
        increment: {short: 'i', type: 'boolean', default: false},
        decrement: {short: 'd', type: 'boolean', default: false},
        number: {short: 'n', type: 'string', default: '1'},
        zero: {short: 'z', type: 'boolean', default: false},
        file: {short: 'f', type: 'string', default: `${homedir()}/.count`}
    },
})
let number = parseInt(/** @type {string} */ (args.number))
let filename = /** @type {import('node:fs').PathLike} */ (args.file)

let data
try {
    let file = await readFile(filename, {encoding: 'utf8'})
    data = JSON.parse(file)
} catch (error) {
    data = {}
}
if (typeof data[`${args.label}`] === 'undefined') data[`${args.label}`] = 0

if (args.increment) data[`${args.label}`] += number
if (args.decrement) data[`${args.label}`] -= number
if (args.zero) delete data[`${args.label}`]

console.info(data[`${args.label}`])

let json = JSON.stringify(data, undefined, 2)
await writeFile(filename, json)
