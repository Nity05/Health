"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Users, TrendingUp, Shield, Brain, Zap, Target, BarChart3 } from "lucide-react";
import { SignedIn, SignInButton, SignedOut, UserButton, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (isLoaded && userId) {
      router.push("/dashboard");
    }
  }, [isLoaded, userId, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Activity className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">CarePredict AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="ghost">ML Analytics</Button>
                </Link>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
                  <Button variant="default">Sign In</Button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-primary/10 to-primary/20 border-primary/30">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered Healthcare Analytics
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Next-Generation AI Risk Prediction Engine
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Harness the power of advanced machine learning algorithms to predict patient outcomes with 94% accuracy,
            identify high-risk individuals before complications arise, and transform chronic care delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignedIn>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Launch Dashboard
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View ML Analytics
                </Button>
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal" afterSignInUrl="/dashboard" afterSignUpUrl="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Sign In to Launch Dashboard
                </Button>
              </SignInButton>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-transparent"
                onClick={() => router.push("/sign-up")}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Sign Up for Free
              </Button>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* ML Capabilities Showcase */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Advanced ML Capabilities</h2>
            <p className="text-muted-foreground text-lg">
              State-of-the-art machine learning models trained on millions of patient records
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-center">Deep Learning Models</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Neural networks trained on 2M+ patient records with ensemble methods for maximum accuracy
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-center">Precision Targeting</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  94% accuracy in predicting 30-day readmissions with 87% sensitivity for high-risk patients
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-center">Real-time Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Sub-second risk score updates with continuous learning from new patient data
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Addressing Critical Healthcare Challenges</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Rising Chronic Disease Burden</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Over 60% of adults have at least one chronic condition, requiring proactive monitoring and
                    intervention.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Reactive Care Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Traditional healthcare often responds to crises rather than preventing them through predictive
                    insights.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Resource Optimization</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Healthcare systems need intelligent tools to allocate resources effectively and improve patient
                    outcomes.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Intelligent Risk Assessment Platform</h2>
            <p className="text-muted-foreground text-lg">
              Advanced AI algorithms with explainable predictions provide actionable insights for evidence-based care
              decisions.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">ML Risk Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Real-time risk assessment with ensemble ML models and color-coded indicators for immediate clinical
                  decision support.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced time-series analysis to predict health trajectories and identify intervention opportunities
                  before complications arise.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Explainable AI</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  SHAP-based feature importance and LIME explanations provide transparent, interpretable results for
                  clinical confidence.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center group hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Smart Cohort Management</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  AI-powered patient stratification with dynamic risk clustering and automated care pathway
                  recommendations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 CarePredict AI. Empowering healthcare through intelligent risk prediction.
          </p>
        </div>
      </footer>
    </div>
  );
}