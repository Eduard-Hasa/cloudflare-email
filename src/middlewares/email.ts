import iEmailSchema, { IEmail } from '../schema/email';

export type EmailRequest = Request & {
	email?: IEmail;
};

const EmailSchemaMiddleware = async (request: EmailRequest) => {
	const { text } = (await request.json()) as { text: string };

	// Extract the client name from the URL
	const url = new URL(request.url);
	const pathSegments = url.pathname.split('/');
	const clientName = pathSegments[pathSegments.length - 1]; // Get the last segment

	// Determine the from and to email addresses based on the client name
	let fromEmail, toEmail;
	switch (clientName) {
		case 'rochesterhandyman':
			fromEmail = 'contact@thehandymanofrochester.com';
			toEmail = 'ed@hasahub.com';
			break;
		// Add more cases for different clients
		// case 'anotherClient':
		//     fromEmail = '...';
		//     toEmail = '...';
		//     break;
		// ...
		default:
			return new Response('Client not found', { status: 404 });
	}

	const emailContent = {
		text: text,
		to: toEmail,
		from: fromEmail,
		subject: `New Inquiry for ${clientName}`,
	};

	const email = iEmailSchema.safeParse(emailContent);
	if (email.success) {
		request.email = email.data;
		return;
	}

	return new Response('Bad Request', {
		status: 400,
	});
};

export default EmailSchemaMiddleware;
