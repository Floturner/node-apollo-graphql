const path = require('path');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { loadFilesSync } = require('@graphql-tools/load-files');

const typeDefs = loadFilesSync(path.join(__dirname, '**/*.graphql'));
const resolvers = loadFilesSync(path.join(__dirname, '**/*.resolvers.js'));

async function startApolloServer() {
	const app = express();
	const httpServer = http.createServer(app);
	const port = 3000;

	const schema = makeExecutableSchema({
		typeDefs,
		resolvers,
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	const server = new ApolloServer({ schema });
	await server.start();

	app.use('/graphql', bodyParser.json(), expressMiddleware(server));

	await new Promise((resolve) => httpServer.listen({ port }, resolve));

	console.log(`GraphQL server ready at http://localhost:${port}`);
}

startApolloServer();
