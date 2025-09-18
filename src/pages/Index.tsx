import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Shield, Users, TrendingUp } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10"></div>
        <div className="container relative mx-auto px-4 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
              <BarChart3 className="mr-2 h-4 w-4" />
              Transforming Municipal Transparency
            </div>
            <h1 className="text-4xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              See Where Your
              <span className="block bg-gradient-primary bg-clip-text text-transparent">
                Budget Goes
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              We transform complex municipal budget PDFs into interactive, citizen-friendly dashboards. Making government spending transparent, accessible, and engaging for everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl">
                <Link to="/dashboard" className="flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Explore Demo Dashboard
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="hover-scale">
                <Link to="/auth">Get Started for Your Municipality</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-cyan-500/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for
            <span className="block text-primary">Transparent Governance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge AI technology with intuitive design to make municipal budgets accessible to every citizen.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500/20 transition-colors">
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              <CardTitle className="text-xl">AI Summarization</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">
                Our advanced AI reads hundreds of pages of budget documents and extracts key insights in seconds.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <CardTitle className="text-xl">Interactive Dashboards</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">
                Track projects, expenses, and budget allocations with real-time interactive visualizations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <CardTitle className="text-xl">Citizen Feedback</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">
                Enable direct communication between citizens and government through integrated feedback systems.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-500/20 transition-colors">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <CardTitle className="text-xl">Standardization</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">
                All municipal budgets converted into one consistent, easy-to-read format across regions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-500/20 transition-colors">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl">Real-time Updates</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">
                Get instant notifications when budget allocations change or new projects are approved.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600/20 transition-colors">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base leading-relaxed">
                Enterprise-grade security ensures your municipal data is protected and compliant.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From complex PDF documents to citizen-friendly dashboards in just four simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Budget PDF</h3>
              <p className="text-muted-foreground">
                Municipality uploads the official budget document in PDF format through our secure portal.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes the document and structures all budget data, identifying key spending categories.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Dashboard Generated</h3>
              <p className="text-muted-foreground">
                Interactive dashboard is automatically created with charts, graphs, and searchable budget data.
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Citizens Engage</h3>
              <p className="text-muted-foreground">
                Citizens explore spending data, track projects, ask questions, and provide feedback on budget allocations.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium">
              ⏱️ Typical Processing Time: <strong className="ml-2">2-5 Minutes</strong>
              <span className="ml-2 text-muted-foreground">From upload to live dashboard</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-cyan-500/20"></div>
        <div className="container relative mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Municipality?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Join progressive municipalities making government spending transparent and accessible to every citizen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-xl">
              <Link to="/dashboard">Explore Live Demo</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-white/30 text-white hover:bg-white/10">
              <Link to="/auth">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
