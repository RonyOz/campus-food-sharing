
const doc ={
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Campus Food Sharing API',
			version: '1.0.0',
			description: 'API para la gestión de usuarios, productos y pedidos.',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Servidor local',
			},
		],
	},
	apis: ['../routes/*.ts'], 
}

const outputFile = '../swagger-output.json'; 
const endpointsFiles = ['../routes/*.ts'];


