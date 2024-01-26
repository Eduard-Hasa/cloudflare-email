import { IRequest, Router } from 'itty-router';
import Email from './controllers/email';
import AuthMiddleware from './middlewares/auth';
import EmailSchemaMiddleware, { EmailRequest } from './middlewares/email';
import { IEmail } from './schema/email';

const router = Router();

// Function to add CORS headers to a response
function handleCors(response, origin) {
	response.headers.set('Access-Control-Allow-Origin', origin);
	response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,POST,OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
	return response;
}

// rochester handyman email.
router.post<EmailRequest>('/rochesterhandyman', AuthMiddleware, EmailSchemaMiddleware, async (request) => {
	const origin = request.headers.get('origin') || '*';

	try {
		const email = request.email as IEmail;
		await Email.send(email);
		const response = new Response('OK', { status: 200 });
		return handleCors(response, origin); // Apply CORS
	} catch (e) {
		console.error(`Error sending email: ${e}`);
		return handleCors(new Response('Internal Server Error', { status: 500 }), origin); // Apply CORS
	}
});

// Preflight request handling for CORS
router.options('*', (request) => {
	const origin = request.headers.get('origin') || '*';
	return handleCors(new Response(null), origin);
});

router.all('*', () => new Response('Not Found', { status: 404 }));

export default {
	fetch: router.handle,
};
