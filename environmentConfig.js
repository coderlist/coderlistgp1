const environmentConfig =  {
  development : {
    url: "http://localhost:3000"
  },
  test: {
    url: "http://localhost:3000"
  },
  production : {
    url: "nope"
  }
};

module.exports =  environmentConfig[process.env.NODE_ENV]
