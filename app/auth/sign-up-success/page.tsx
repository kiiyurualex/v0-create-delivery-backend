import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Mail, CheckCircle } from "lucide-react";

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <Link href="/" className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-purple-dark">Antex Deliveries</span>
          </Link>
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Check Your Email</CardTitle>
          <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-teal/10 rounded-lg p-4 flex items-center gap-3">
            <Mail className="w-6 h-6 text-teal" />
            <p className="text-sm text-gray-600 text-left">
              Please check your email inbox and click the confirmation link to activate your account.
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            Didn&apos;t receive the email? Check your spam folder or try signing up again.
          </p>

          <div className="flex gap-3 pt-4">
            <Link href="/auth/login" className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                Back to Login
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full bg-purple hover:bg-purple-dark text-white">
                Go Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
