import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-3">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                LeadVett ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard 
                your information when you use our lead qualification service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Information We Collect</h2>
              <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Name and email address (when you create an account)</li>
                <li>Form responses submitted by your leads</li>
                <li>Payment information (processed securely through our payment provider)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">How We Use Your Information</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Analyze usage patterns and improve user experience</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">AI Processing</h2>
              <p className="text-gray-700 leading-relaxed">
                We use OpenAI's services to analyze lead responses and generate qualification scores. 
                Lead data is processed through OpenAI's API in accordance with their data usage policies. 
                We do not use your data to train AI models.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                Your data is stored securely using industry-standard encryption.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your information for as long as your account is active or as needed to 
                provide you services. You may request deletion of your account and associated data 
                at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
              <p className="text-gray-700 leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:{' '}
                <a href="mailto:privacy@leadvett.com" className="text-primary hover:underline">
                  privacy@leadvett.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}