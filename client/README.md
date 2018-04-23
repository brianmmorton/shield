This is a simple boilerplate that uses react router, redux, and bootstrap on top of create react app. Often I want a boilerplate with something like this, simple and clean, but they include a bunch of other stuff. 

## Install
`
$ git clone https://github.com/brianmmorton/react-redux-bootstrap-router.git
$ cd react-redux-bootstrap-router
$ npm i
`

## Start
`
$ npm start
`

## Test
`
$ npm run test
`

## Bootstrap style overrides
To override styles for bootstrap, use the styles directory. Add a file for the component name and write in the styles in bootstrap format, ie btn, btn-default, btn-lg, etc.

## Remove Bootstrap
`
$ npm uninstall --save reactstrap
--> styles/*.css may has bootstrap overrides
-->  Remove all places using reactstrap and replace with whatever
`
