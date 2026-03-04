import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* <!-- Google tag (gtag.js) --> */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ"></script>
      <script dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6QJQ6KGNJ');
      `}}></script>
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">Agreement to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                By accessing or using LeadVett, you agree to be bound by these Terms of Service 
                and our Privacy Policy. If you disagree with any part of these terms, you may 
                not access the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Description of Service</h2>
              <p className="text-gray-700 leading-relaxed">
                LeadVett is a lead qualification platform that uses AI to analyze and score 
                potential customers based on custom criteria you define. The service includes 
                form creation, lead data collection, AI analysis, and reporting tools.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">User Accounts</h2>
              <h3 className="text-xl font-semibold mb-2">Account Creation</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                You must create an account to use LeadVett. You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Be responsible for all activity under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Acceptable Use</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You agree NOT to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Use the service for any illegal purpose</li>
                <li>Collect personal information without consent</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service</li>
                <li>Use the service to spam or harass others</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Subscription and Payment</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                LeadVett offers subscription-based pricing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Subscriptions are billed monthly in advance</li>
                <li>You may cancel your subscription at any time</li>
                <li>No refunds for partial months</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Data Ownership</h2>
              <p className="text-gray-700 leading-relaxed">
                You retain all rights to the data you input into LeadVett. We do not claim 
                ownership of your forms, leads, or responses. You grant us a limited license 
                to process your data solely to provide the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">AI-Generated Content</h2>
              <p className="text-gray-700 leading-relaxed">
                LeadVett uses AI to analyze leads and generate recommendations. While we strive 
                for accuracy, AI-generated content may contain errors. You are responsible for 
                reviewing and verifying all AI outputs before taking action.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                LeadVett is provided "as is" without warranties of any kind. We are not liable 
                for any indirect, incidental, special, consequential, or punitive damages resulting 
                from your use of the service. Our total liability shall not exceed the amount you 
                paid in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Termination</h2>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account immediately, without prior notice, for 
                any violation of these Terms. Upon termination, your right to use the service 
                will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify you of 
                material changes by email or through the service. Continued use after changes 
                constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Contact</h2>
              <p className="text-gray-700 leading-relaxed">
                For questions about these Terms, contact us at:{' '}
                <a href="mailto:legal@leadvett.com" className="text-primary hover:underline">
                  legal@leadvett.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}