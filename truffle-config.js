module.exports = {
    migrations_directory: "./migrations",
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*",
            gas: 9600000,
	gasLimit: 0x8000000
        }
    }
};
