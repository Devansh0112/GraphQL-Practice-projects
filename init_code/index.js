var express = require('express');
var { createHandler } = require('graphql-http/lib/use/express');
var { buildSchema } = require('graphql');

var schema = buildSchema(`
    type Query {
        quoteOfTheDay: String
        random: Float!
        rollThreeDice: [Int],
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
    `)

var root = {
    quoteOfTheDay() {
        return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within"
    },
    random() {
        return Math.random()
    },
    rollThreeDice() {
        return [1,2,3].map(_ => 1 + Math.floor(Math.random() * 6))
    },
    rollDice({ numDice, numSides }) {
        var output = []
        for (var i = 0; i < numDice; i++) {
            output.push(1 + Math.floor(Math.random() * (numSides || 6)))
        }
        return output
    }
}

var app = express()

app.all(
    "/graphql",
    createHandler({
        schema: schema,
        rootValue: root
    })
)

app.listen(4000)
console.log("App is running...")