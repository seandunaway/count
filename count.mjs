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

let data
try {
    let file = await readFile(/** @type {import('node:fs').PathLike} */ (args.file), {encoding: 'utf8'})
    data = JSON.parse(file)
} catch (error) {
    data = {}
}
if (typeof data[`${args.label}`] === 'undefined') data[`${args.label}`] = 0

let number_integer = parseInt(/** @type {string} */ (args.number))
if (args.increment) data[`${args.label}`] += number_integer
if (args.decrement) data[`${args.label}`] -= number_integer
if (args.zero) delete data[`${args.label}`]

console.info(data[`${args.label}`])

let json = JSON.stringify(data, undefined, 4)
await writeFile(/** @type {import('node:fs').PathLike} */ (args.file), json)

