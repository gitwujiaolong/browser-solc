# browser-solc-tron

tron solidity compiler

## About the fork

Forked from https://github.com/ericxtang/browser-solc to wrap it into a npm package so that it can be easily imported into a Webpack (or another bundler) web app.



## Installation

`npm install --save browser-solc-tron`

## Usage:

```javascript


import browserSolc from 'browser-solc-tron';
const getCompiler = function(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            window.BrowserSolc.loadSolcJson('',(compiler)=>{
                if(compiler){
                    resolve(compiler.compile)
                }else{
                    reject('it is an error')
                }
            })

        })

    })
}

export default getCompiler;


```


## Development
To build `index.js`, run `npm run build`.

Note: browser-solc-tron does NOT implement the whole interface of solc-js.
