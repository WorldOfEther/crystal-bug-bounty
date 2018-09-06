require('dotenv').config({silent: true});

require('babel-register')({
    ignore: /node_modules\/(?!zeppelin-solidity)/
});
require('babel-polyfill');

module.exports = {
    networks: {
        development: {
            host: process.env.ETH_NODE_HOST || "localhost",
            port: process.env.ETH_NODE_PORT || 8545,
            network_id: "*"
        },
        rinkeby: {
            network_id: 4,
            port: 8545,
            gas: 2900000
        }
    },
    mocha: {
        reporter: "mocha-multi-reporters",  
        reporterOptions: {  
            reporterEnabled: "spec, mocha-junit-reporter",
            mochaJunitReporterReporterOptions: {
                mochaFile: './reports/junit-truffle.xml',
                useFullSuiteTitle: true,
                rootSuiteTitle: "Truffle Tests",
            }
        }
    }
};
