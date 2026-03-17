import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { email, name } = await req.json()
  
await resend.emails.send({
 from: 'Abdirahman from LeadVett <contact@leadvett.com>',
  replyTo: 'contact@leadvett.com',
  to: email,
    subject: 'Welcome to LeadVett — quick start guide',
    text: `Hey ${name},

I'm Abdirahman, founder of LeadVett.

Thanks for signing up. Here's how to get started in 2 minutes:

1. Go to leadvett.com/dashboard
2. Click "Create Form"
3. Add 3-5 questions about budget, timeline, authority
4. Share your form link instead of Calendly

That's it. Next lead that reaches out — send them your LeadVett link instead of your calendar.

Any questions? Reply to this email directly. I read every one.

— Abdirahman
Founder, LeadVett
leadvett.com`
  })
}