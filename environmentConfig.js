const environmentConfig =  {
  development : {
    url: "http://localhost:3000"
  },
  test: {
    url: "http://localhost:3000"
  },
  production : {
    url: "https://www.ginnybradley.co.uk"
  }
};

module.exports =  environmentConfig[process.env.NODE_ENV]
