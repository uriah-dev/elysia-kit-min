# Email Configuration Guide

This guide covers the email setup in Elysia Kit and how to switch between
providers.

## Current Setup: Resend

The default email provider is [Resend](https://resend.com). Configuration
requires:

```env
RESEND_API_KEY=re_*************
RESEND_MAIL=you@yourdomain.com
```

## Switching to SendGrid

### 1. Install SendGrid SDK

```bash
bun add @sendgrid/mail
```

### 2. Update Environment Variables

Replace the Resend variables in your `.env`:

```env
# Remove these
# RESEND_API_KEY=...
# RESEND_MAIL=...

# Add these
SENDGRID_API_KEY=SG.****************************
SENDGRID_MAIL=you@yourdomain.com
```

### 3. Update `src/env.ts`

Replace the Resend env schema:

```diff
- RESEND_API_KEY: z.string().min(1).startsWith("re_"),
- RESEND_MAIL: z.string().email(),
+ SENDGRID_API_KEY: z.string().min(1).startsWith("SG."),
+ SENDGRID_MAIL: z.string().email(),
```

### 4. Update `src/emails/index.ts`

Replace the email module with SendGrid:

```typescript
import sgMail from "@sendgrid/mail";
import { env } from "@src/env";
import { logger, tryWrapper } from "@src/lib/utils";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export type SendEmailParams = {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    from?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
};

export type SendEmailResult = {
    success: boolean;
    id?: string;
    error?: string;
};

export const sendEmail = async (
    params: SendEmailParams,
): Promise<SendEmailResult> => {
    return tryWrapper(async () => {
        const msg = {
            to: params.to,
            from: params.from || env.SENDGRID_MAIL,
            subject: params.subject,
            html: params.html,
            ...(params.text && { text: params.text }),
            ...(params.replyTo && { replyTo: params.replyTo }),
            ...(params.cc && { cc: params.cc }),
            ...(params.bcc && { bcc: params.bcc }),
        };

        const [response] = await sgMail.send(msg);
        const messageId = response.headers["x-message-id"];

        logger.info(
            { emailId: messageId, to: params.to },
            "Email sent successfully",
        );

        return { success: true, id: messageId };
    }).catch((error) => {
        logger.error({ error, to: params.to }, "Failed to send email");
        return { success: false, error: error.message };
    });
};
```

---

## Email Templates

Templates use [React Email](https://react.email) with JSX. See `welcome.tsx` for
an example.

### Preview Templates

```bash
bunx email dev
```

### Render to HTML

```typescript
import { render } from "@react-email/render";
import { WelcomeEmail } from "./welcome";

const html = await render(<WelcomeEmail name="John" />);
```
