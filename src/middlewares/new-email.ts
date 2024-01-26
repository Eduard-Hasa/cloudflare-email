import iEmailSchema, { IEmail } from '../schema/email';

export type EmailRequest = Request & {
	email?: IEmail;
};

/**
 * Middleware to validate the request body against the email schema
 * @param request
 * @constructor
 */
export const ExtractAndModifyEmailMiddleware = async (request: EmailRequest) => {
	const { text } = (await request.json()) as { text: string };

	// Set other fields manually
	const modifiedEmail = {
		text: text,
		to: 'ed@hasahub.com',
		from: 'contact@thehandymanofrochester.com',
		subject: 'New Rochester Handyman Inquiry',
	};

	request.email = modifiedEmail;
	return;
};
