var rimfar = require('../')
var t = require('tap')

var fs = require('fs')
var fill = require('./fill.js')

t.test('initial clean', function (t) {
  rimfar.sync(__dirname + '/target')
  t.throws(function () {
    fs.statSync(__dirname + '/target')
  })
  t.end()
})

t.test('sync removal', function (t) {
  fill()
  t.ok(fs.statSync(__dirname + '/target').isDirectory())

  rimfar.sync(__dirname + '/target')
  t.throws(function () {
    fs.statSync(__dirname + '/target')
  })
  t.end()
})

t.test('async removal', function (t) {
  fill()
  t.ok(fs.statSync(__dirname + '/target').isDirectory())

  rimfar(__dirname + '/target', function (er) {
    if (er)
      throw er
    t.throws(function () {
      fs.statSync(__dirname + '/target')
    })
    t.end()
  })
})

t.test('glob', function (t) {
  t.plan(2)
  t.test('async', function (t) {
    fill()
    var glob = require('glob')
    var pattern = __dirname + '/target/f-*'
    var before = glob.sync(pattern)
    t.notEqual(before.length, 0)
    rimfar(pattern, function (er) {
      if (er)
        throw er
      var after = glob.sync(pattern)
      t.same(after, [])
      rimfar.sync(__dirname + '/target')
      t.end()
    })
  })
  t.test('sync', function (t) {
    fill()
    var glob = require('glob')
    var pattern = __dirname + '/target/f-*'
    var before = glob.sync(pattern)
    t.notEqual(before.length, 0)
    rimfar.sync(pattern)
    var after = glob.sync(pattern)
    t.same(after, [])
    rimfar.sync(__dirname + '/target')
    t.end()
  })
})

t.test('no glob', function (t) {
  t.plan(2)
  t.test('async', function (t) {
    fill()
    var glob = require('glob')
    var pattern = __dirname + '/target/f-*'
    var before = glob.sync(pattern)
    t.notEqual(before.length, 0)
    rimfar(pattern, { disableGlob: true }, function (er) {
      if (er)
        throw er
      var after = glob.sync(pattern)
      t.same(after, before)
      rimfar.sync(__dirname + '/target')
      t.end()
    })
  })
  t.test('sync', function (t) {
    fill()
    var glob = require('glob')
    var pattern = __dirname + '/target/f-*'
    var before = glob.sync(pattern)
    t.notEqual(before.length, 0)
    rimfar.sync(pattern, { disableGlob: true })
    var after = glob.sync(pattern)
    t.same(after, before)
    rimfar.sync(__dirname + '/target')
    t.end()
  })
})

t.test('verify that cleanup happened', function (t) {
  t.throws(fs.statSync.bind(fs, __dirname + '/../target'))
  t.throws(fs.statSync.bind(fs, __dirname + '/target'))
  t.end()
})
