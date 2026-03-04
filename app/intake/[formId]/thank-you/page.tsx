import { CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {/* <!-- Google tag (gtag.js) --> */}
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-C6QJQ6KGNJ"></script>
      <script dangerouslySetInnerHTML={{__html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){window.dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6QJQ6KGNJ');
      `}}></script>
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Thank You!</h1>
          <p className="text-muted-foreground">
            Your response has been submitted successfully. We&apos;ll be in touch
            soon.
          </p>
        </div>
      </div>
    </div>
  )
}

