import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { leads } = await req.json()

    if (!leads || leads.length === 0) {
      return Response.json({ error: 'No leads provided' }, { status: 400 })
    }

    const results = await Promise.all(
      leads.map((lead: any) =>
        resend.emails.send({
          from: 'Abdirahman from LeadVett <contact@leadvett.com>',
          replyTo: 'contact@leadvett.com',
          to: lead.email,
          subject: lead.subject,
          text: lead.message,
        })
      )
    )

    return Response.json({ sent: results.length, results })
  } catch (error) {
    console.error('Outreach email error:', error)
    return Response.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}