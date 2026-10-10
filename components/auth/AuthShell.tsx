import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import styles from './auth.module.css'

type AuthShellProps = {
  mode: 'login' | 'signup'
  title: string
  description: string
  children: ReactNode
}

const stories = {
  login: {
    eyebrow: 'YOUR STUDIO INBOX',
    headline: <>Make room for<br /><em>the right projects.</em></>,
    description: 'Pick up where you left off. Review each website enquiry against the criteria your studio cares about.',
    steps: [['01', 'See what fits'], ['02', 'Clarify what is missing'], ['03', 'Choose the next step']],
  },
  signup: {
    eyebrow: 'MADE FOR WEB STUDIOS',
    headline: <>Start with a better<br /><em>project enquiry.</em></>,
    description: 'Set your project criteria, share one intake link, and review budget, scope and timing before discovery.',
    steps: [['01', 'Set the project minimum'], ['02', 'Share your intake link'], ['03', 'Review every enquiry']],
  },
}

export function AuthShell({ mode, title, description, children }: AuthShellProps) {
  const story = stories[mode]
  return (
    <main className={styles.page}>
      <section className={styles.story} aria-labelledby="auth-story-title">
        <div className={styles.storyGlow} aria-hidden="true" />
        <Link href="/" className={styles.brand} aria-label="LeadVett home">
          <Image src="/images/leadicon.png" alt="" width={42} height={36} priority />
          <span>Lead<strong>Vett</strong></span>
        </Link>
        <div className={styles.storyContent}>
          <p className={styles.eyebrow}><span aria-hidden="true" />{story.eyebrow}</p>
          <h1 id="auth-story-title">{story.headline}</h1>
          <p className={styles.storyDescription}>{story.description}</p>
          <ol className={styles.steps}>
            {story.steps.map(([number, text]) => (
              <li key={number}><span>{number}</span><p>{text}</p></li>
            ))}
          </ol>
        </div>
        <div className={styles.storyFoot}>
          <Link href="/">Website project qualification</Link>
          <span>Made for independent studios</span>
        </div>
      </section>

      <section className={styles.formSide} aria-labelledby="auth-form-title">
        <div className={styles.formTop}><span>LEADVETT</span><span>Free early access</span></div>
        <div className={styles.card}>
          <div className={styles.mobileBrand}>
            <Image src="/images/leadicon.png" alt="" width={34} height={30} priority />
            <span>Lead<strong>Vett</strong></span>
          </div>
          <p className={styles.cardEyebrow}>{mode === 'signup' ? 'GET STARTED' : 'WELCOME BACK'}</p>
          <h2 id="auth-form-title">{title}</h2>
          <p className={styles.formDescription}>{description}</p>
          {children}
          <p className={styles.terms}>By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
        </div>
        <p className={styles.formFoot}>A clearer first step for your next project.</p>
      </section>
    </main>
  )
}

export function GoogleMark() {
  return <svg aria-hidden="true" viewBox="0 0 48 48" className={styles.googleMark}>
    <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
    <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
    <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z" />
    <path fill="#EA4335" d="M24 12c3 0 5.7 1 7.8 3.1l5.9-5.9A19.7 19.7 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.3C14.2 15.6 18.7 12 24 12Z" />
  </svg>
}
