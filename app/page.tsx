'use client';

import Link from 'next/link';
import { Shield, Building2, Sparkles, ArrowRight, Users, UserCheck, Clock, CheckCircle, Play, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { LoginModal } from '@/components/LoginModal';
import { DemoCarousel } from '@/components/DemoCarousel';
import { useState, useEffect } from 'react';

export default function Home() {
  const { user, userRole, isAuthenticated, login } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    companies: 0,
    newHires: 0,
    onboardingTime: 0,
    satisfaction: 0
  });

  // Count-up animation for stats
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedStats(prev => ({
        companies: prev.companies < 500 ? prev.companies + 12 : 500,
        newHires: prev.newHires < 50000 ? prev.newHires + 1000 : 50000,
        onboardingTime: prev.onboardingTime < 85 ? prev.onboardingTime + 2 : 85,
        satisfaction: prev.satisfaction < 4.9 ? Math.min(prev.satisfaction + 0.1, 4.9) : 4.9
      }));
    }, 50);

    setTimeout(() => clearInterval(interval), 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      quote: "Buddy cut our onboarding time in half and boosted new hire satisfaction.",
      author: "Sarah Johnson",
      role: "HR Director",
      company: "Acme Inc.",
      avatar: "SJ"
    },
    {
      quote: "The AI assistant is incredible. It answers questions instantly and guides through every step.",
      author: "Mike Rodriguez",
      role: "Engineering Manager",
      company: "StartupXYZ",
      avatar: "MR"
    },
    {
      quote: "Best onboarding experience ever! Buddy made everything so simple and welcoming.",
      author: "Anna Chen",
      role: "New Hire",
      company: "InnovateCo",
      avatar: "AC"
    }
  ];

  // Get next pending task for employee
  const getNextTask = () => {
    if (!user || userRole !== 'employee') return null;

    try {
      const dataStore = require('@/lib/dataStore').dataStore;
      const tasks = dataStore.getEmployeeTasks(user.id);
      const pendingTasks = tasks.filter((task: any) => task.status === 'todo');

      if (pendingTasks.length > 0) {
        // Sort by priority/importance (you can customize this logic)
        const sortedTasks = pendingTasks.sort((a: any, b: any) => {
          const priorityOrder = ['HR', 'IT', 'Security', 'Communication', 'Admin', 'Welcome'];
          const aPriority = priorityOrder.indexOf(a.category);
          const bPriority = priorityOrder.indexOf(b.category);
          return aPriority - bPriority;
        });

        return sortedTasks[0];
      }
    } catch (error) {
      console.error('Error getting next task:', error);
    }

    return null;
  };

  const nextTask = getNextTask();

  const features = [
    {
      icon: UserCheck,
      title: 'AI-Powered Onboarding',
      description: 'Intelligent chatbot assistance for seamless employee integration',
      color: 'from-[#e99f75] to-orange-500'
    },
    {
      icon: Clock,
      title: 'Real-time Progress Tracking',
      description: 'Monitor onboarding status with live updates and analytics',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Role-Based Access Control',
      description: 'Secure HR dashboard and employee portal separation',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Users,
      title: 'Comprehensive HR Management',
      description: 'Complete overview of all employee onboarding processes',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Enhanced Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-400/10 to-purple-400/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-transparent to-white/40"></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-pink-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-lg animate-bounce"></div>
          <div className="absolute bottom-32 left-1/3 w-20 h-20 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-md animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-16 h-16 bg-gradient-to-br from-pink-200/30 to-purple-200/30 rounded-full blur-sm animate-bounce"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Enhanced Logo and Brand with Animation */}
            <div className="flex justify-center mb-8 animate-bounce">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-orange-400 via-[#e99f75] to-red-400 rounded-3xl flex items-center justify-center shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                  <div className="w-28 h-28 bg-white dark:bg-gray-900 rounded-2xl flex items-center justify-center">
                    {/* Hero Robot Logo - Larger Version */}
                    <svg
                      width="56"
                      height="56"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="drop-shadow-sm animate-pulse"
                    >
                      {/* Robot Head Base */}
                      <rect
                        x="8"
                        y="12"
                        width="24"
                        height="20"
                        rx="8"
                        fill="url(#heroRobotGradient)"
                        stroke="url(#heroRobotBorder)"
                        strokeWidth="2"
                      />

                      {/* Eyes */}
                      <circle cx="16" cy="18" r="3" fill="white" opacity="0.9" />
                      <circle cx="24" cy="18" r="3" fill="white" opacity="0.9" />
                      <circle cx="16" cy="18" r="1.5" fill="#e99f75" />
                      <circle cx="24" cy="18" r="1.5" fill="#e99f75" />

                      {/* Mouth/Smile */}
                      <path
                        d="M 14 24 Q 20 28 26 24"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        fill="none"
                      />

                      {/* Antenna */}
                      <line x1="20" y1="12" x2="20" y2="8" stroke="#e99f75" strokeWidth="2" />
                      <circle cx="20" cy="6" r="2" fill="#e99f75" />

                      {/* Circuit Pattern on Head */}
                      <path d="M 12 16 L 14 16 L 14 18" stroke="white" strokeWidth="1" opacity="0.6" />
                      <path d="M 26 16 L 28 16 L 28 18" stroke="white" strokeWidth="1" opacity="0.6" />

                      {/* Gradient Definitions */}
                      <defs>
                        <linearGradient id="heroRobotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#e99f75" />
                          <stop offset="100%" stopColor="#f4a261" />
                        </linearGradient>
                        <linearGradient id="heroRobotBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#ea580c" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-[#e99f75] rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-xs">✨</span>
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="mb-12 animate-fade-in-up">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Get new hires productive{' '}
                <span className="bg-gradient-to-r from-orange-600 via-[#e99f75] to-red-600 bg-clip-text text-transparent">
                  40% faster
                </span>
        </h1>
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium mb-4">
                with AI-powered onboarding.
              </p>
              {/* New Value Prop Sub-headline */}
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium animate-fade-in-up animation-delay-100">
                Simplify HR workflows and give employees a smoother start from day one.
              </p>
            </div>

            {/* Enhanced Subheadline */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in-up animation-delay-200 leading-relaxed">
              Everything you need to onboard faster: automated checklists, AI guidance, and real-time progress tracking.
            </p>

            {/* Trust Indicators */}
            <div className="mb-12 animate-fade-in-up animation-delay-300">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium">Trusted by growing teams worldwide</p>
              <div className="flex justify-center items-center space-x-8 opacity-70">
                <div className="text-gray-500 dark:text-gray-400 font-semibold text-lg hover:text-[#e99f75] transition-colors duration-200">Stripe</div>
                <div className="text-gray-500 dark:text-gray-400 font-semibold text-lg hover:text-[#e99f75] transition-colors duration-200">Slack</div>
                <div className="text-gray-500 dark:text-gray-400 font-semibold text-lg hover:text-[#e99f75] transition-colors duration-200">Notion</div>
                <div className="text-gray-500 dark:text-gray-400 font-semibold text-lg hover:text-[#e99f75] transition-colors duration-200">Linear</div>
              </div>
            </div>

            {!isAuthenticated ? (
              <div className="mb-8 animate-fade-in-up animation-delay-500">
                {/* Primary CTA */}
                <div className="flex justify-center mb-6">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="group inline-flex items-center px-10 py-5 bg-gradient-to-r from-orange-600 to-[#e99f75] hover:from-orange-700 hover:to-[#e99f75] text-white text-xl font-bold rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 hover:glow-orange"
                    aria-label="Start your onboarding journey in minutes"
                    title="Start your onboarding journey in minutes"
                  >
                    <Sparkles className="w-7 h-7 mr-3 group-hover:animate-pulse" />
                    🚀 Start Onboarding
                    <ArrowRight className="w-7 h-7 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>

                {/* Secondary CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-[#e99f75] dark:hover:border-[#e99f75] text-gray-700 dark:text-gray-300 hover:text-[#e99f75] dark:hover:text-[#e99f75] font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                    aria-label="Access HR Dashboard"
                  >
                    <span className="text-lg mr-2">👩‍💼</span>
                    HR Dashboard
                  </button>

                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="group inline-flex items-center px-6 py-3 border-2 border-gray-300 dark:border-gray-600 hover:border-[#e99f75] dark:hover:border-[#e99f75] text-gray-700 dark:text-gray-300 hover:text-[#e99f75] dark:hover:text-[#e99f75] font-medium rounded-lg transition-all duration-200 hover:shadow-md"
                    aria-label="Access Employee Portal"
                  >
                    <span className="text-lg mr-2">👨‍💻</span>
                    Employee Portal
                  </button>
                </div>

                {/* Built by Zenafide */}
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-8 text-center animate-fade-in-up animation-delay-400">
                  Built with ❤️ by <span className="font-semibold text-[#e99f75] dark:text-[#e99f75]">Zenafide</span>
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 max-w-md mx-auto mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Welcome back, {user?.name}! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Continue your onboarding journey or manage your team.
                </p>
                <div className="space-y-3">
                  {userRole === 'employee' && (
                    <Link
                      href="/employee"
                      className="block w-full text-center px-6 py-3 bg-[#e99f75] hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      {nextTask ? (
                        <div>
                          <div className="font-semibold">Continue Onboarding</div>
                          <div className="text-sm opacity-90 mt-1">
                            Next: {nextTask.title} (~{nextTask.estimated_time})
                          </div>
                        </div>
                      ) : (
                        'Continue Onboarding'
                      )}
                    </Link>
                  )}
                  {userRole === 'hr' && (
                    <Link
                      href="/hr-dashboard"
                      className="block w-full text-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      HR Dashboard
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto animate-fade-in-up animation-delay-600">
              <div className="group text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-orange-200/60 dark:border-orange-800/60 hover:shadow-2xl hover:scale-110 transition-all duration-500 hover:border-orange-300 dark:hover:border-orange-600">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-3 group-hover:text-orange-700 transition-colors duration-300">{animatedStats.companies}+</div>
                <div className="text-gray-700 dark:text-gray-300 text-base font-semibold">Companies</div>
              </div>

              <div className="group text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-green-200/60 dark:border-green-800/60 hover:shadow-2xl hover:scale-110 transition-all duration-500 hover:border-green-300 dark:hover:border-green-600">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-green-600 mb-3 group-hover:text-green-700 transition-colors duration-300">{Math.floor(animatedStats.newHires / 1000)}K+</div>
                <div className="text-gray-700 dark:text-gray-300 text-base font-semibold">New Hires</div>
              </div>

              <div className="group text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-blue-200/60 dark:border-blue-800/60 hover:shadow-2xl hover:scale-110 transition-all duration-500 hover:border-blue-300 dark:hover:border-blue-600">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-blue-600 mb-3 group-hover:text-blue-700 transition-colors duration-300">{animatedStats.onboardingTime}%</div>
                <div className="text-gray-700 dark:text-gray-300 text-base font-semibold">Faster Onboarding</div>
              </div>

              <div className="group text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-yellow-200/60 dark:border-yellow-800/60 hover:shadow-2xl hover:scale-110 transition-all duration-500 hover:border-yellow-300 dark:hover:border-yellow-600">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Star className="w-10 h-10 text-white" />
                </div>
                <div className="text-5xl md:text-6xl font-bold text-yellow-600 mb-3 group-hover:text-yellow-700 transition-colors duration-300">{animatedStats.satisfaction.toFixed(1)}/5</div>
                <div className="text-gray-700 dark:text-gray-300 text-base font-semibold">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Testimonials Section */}
      <div className="py-24 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See what HR leaders and new hires say about Buddy's impact on their onboarding experience
            </p>
          </div>

          {/* Testimonials Grid - Shows 2-3 at once on desktop */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 border border-gray-200 dark:border-gray-700 hover:scale-105"
              >
                {/* Company Logo Placeholder */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl flex items-center justify-center">
                    <span className="text-orange-600 font-bold text-sm">
                      {testimonial.company.charAt(0)}
                    </span>
                  </div>
                  <Quote className="w-8 h-8 text-orange-500 opacity-60 group-hover:opacity-80 transition-opacity" />
                </div>

                {/* Testimonial Quote */}
                <blockquote className="text-lg font-medium text-gray-900 dark:text-white mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-lg">{testimonial.avatar}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 text-sm">
                      {testimonial.role}
                    </div>
                    <div className="text-orange-600 font-medium text-sm">
                      {testimonial.company}
                    </div>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex text-yellow-400 mt-4">
                  <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Ready to transform your onboarding experience?
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-600 to-[#e99f75] hover:from-orange-700 hover:to-[#e99f75] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Join 500+ Companies
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Product Demo Section */}
      <div className="py-24 bg-gradient-to-br from-slate-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              See Buddy in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              Watch how our AI-powered onboarding system transforms the employee experience from day one.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Enhanced Video Section */}
            <div className="relative">
              <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
                <div className="aspect-video bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center relative overflow-hidden">
                  {/* Enhanced Animated background pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-24 h-24 border-2 border-orange-500 rounded-full animate-pulse opacity-60"></div>
                    <div className="absolute bottom-20 right-20 w-20 h-20 bg-orange-500/40 rounded-lg rotate-45 animate-bounce"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-br from-orange-400/30 to-pink-400/30 rounded-full blur-xl animate-pulse"></div>
                  </div>

                  <div className="text-center relative z-10">
                    {/* Bigger Play Button with Pulse Animation */}
                    <div className="relative mb-8">
                      <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-pulse hover:animate-none transition-all duration-300 group-hover:scale-110 group-hover:shadow-3xl">
                        <Play className="w-12 h-12 text-white ml-1" />
                      </div>
                      {/* Pulsing ring effect */}
                      <div className="absolute inset-0 rounded-full border-4 border-orange-400 animate-ping opacity-30"></div>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-4">Product Demo</h3>
                    <p className="text-gray-300 mb-8 max-w-sm mx-auto text-lg">Interactive walkthrough of Buddy's AI-powered onboarding platform</p>
                    <button className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-pink-600 transition-all duration-300 hover:shadow-2xl hover:scale-105">
                      <Play className="w-6 h-6 mr-3" />
                      Watch Demo
                    </button>
                  </div>
                </div>

                {/* Enhanced Video controls overlay */}
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
                  <div className="text-white text-sm font-medium">
                    <span>0:00</span> / <span className="text-gray-400">3:24</span>
                  </div>
                  <div className="flex space-x-3">
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" aria-label="Volume">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6l-6 6H2a1 1 0 01-1-1V9a1 1 0 011-1h4l6-6v12l-6-6H2a1 1 0 01-1-1v-2a1 1 0 011-1h4z" />
                      </svg>
                    </button>
                    <button className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110" aria-label="Fullscreen">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V4a1 1 0 00-1-1zM3 21h6a1 1 0 001-1v-6a1 1 0 00-1-1H3a1 1 0 00-1 1v6a1 1 0 001 1z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Feature Highlights with Icons */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose Buddy?
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
                  Experience the future of employee onboarding with our AI-powered platform designed for modern workplaces.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 dark:from-orange-600 dark:to-orange-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      🤖 AI-Powered Guidance
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Intelligent chatbot answers questions instantly and guides users through complex processes with personalized assistance and smart recommendations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-500 dark:from-blue-600 dark:to-blue-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      📊 Real-Time Progress Tracking
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Live dashboard updates show completion status, bottlenecks, and personalized recommendations for faster, more efficient onboarding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-500 dark:from-green-600 dark:to-green-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      🔒 Role-Based Security
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Enterprise-grade security with role-based access control, ensuring HR and employees see only relevant information in a compliant environment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-6 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      👥 HR Insights & Analytics
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      Comprehensive analytics and insights to optimize your onboarding process, track team performance, and make data-driven decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Buddy Onboarding Hub?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of employee onboarding with cutting-edge technology and intuitive design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-600"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portal Access Section */}
      <div className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Access Your Portal
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose your role to access the appropriate dashboard and tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {isAuthenticated && userRole === 'employee' ? (
        <Link href="/employee" className="group">
                <div className="p-8 bg-gradient-to-br from-[#e99f75] to-orange-600 rounded-2xl text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <UserCheck className="w-12 h-12" />
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Employee Portal</h3>
                  <p className="text-orange-100 opacity-90">
                    Access your onboarding tasks, AI assistance, and progress tracking.
                  </p>
                </div>
              </Link>
            ) : (
              <div className="p-8 bg-gray-200 dark:bg-gray-700 rounded-2xl text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2 mb-4">
                  <UserCheck className="w-12 h-12" />
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Employee Portal</h3>
                <p className="opacity-75">
                  Sign in as an employee to access your onboarding portal.
                </p>
              </div>
            )}

            {isAuthenticated && userRole === 'hr' ? (
              <Link href="/hr-dashboard" className="group">
                <div className="p-8 bg-gradient-to-br from-orange-600 to-pink-600 rounded-2xl text-white hover:from-orange-700 hover:to-pink-700 transition-all duration-300 hover:shadow-xl transform hover:scale-105">
                  <div className="flex items-center justify-between mb-4">
                    <Building2 className="w-12 h-12" />
                    <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">HR Dashboard</h3>
                  <p className="text-pink-100 opacity-90">
                    Manage employee onboarding, track progress, and view analytics.
                  </p>
                </div>
              </Link>
            ) : (
              <div className="p-8 bg-gray-200 dark:bg-gray-700 rounded-2xl text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2 mb-4">
                  <Building2 className="w-12 h-12" />
                  <Shield className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-2">HR Dashboard</h3>
                <p className="opacity-75">
                  Sign in as HR to access the management dashboard.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div id="demo-section" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              See Buddy in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Watch how our AI-powered onboarding system streamlines the employee experience
            </p>
          </div>

          {/* Demo Carousel */}
          {/* Demo Login Section */}
        <div className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800 shadow-lg">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 Try the Demo
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience our AI-powered onboarding platform with demo accounts - no setup required!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* HR Demo Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">👨‍💼 HR Dashboard</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage onboarding processes & analytics</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                    <button
                      className="group/copy relative"
                      title="Click to copy email"
                      onClick={() => navigator.clipboard.writeText('hr@acme.com')}
                    >
                      <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        hr@acme.com
                      </code>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Click to copy
                      </div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password:</span>
                    <button
                      className="group/copy relative"
                      title="Click to copy password"
                      onClick={() => navigator.clipboard.writeText('demo123')}
                    >
                      <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                        demo123
                      </code>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Click to copy
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Monitor employee progress
                </div>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Send reminders & notifications
                </div>
                <div className="flex items-center text-sm text-purple-600 dark:text-purple-400">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Add new hires & view analytics
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try HR Demo →
                </button>
              </div>
            </div>

            {/* Employee Demo Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">👨‍💻 Employee Portal</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete onboarding tasks & get AI help</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Try any of these accounts:
                </div>
                <div className="space-y-2">
                  {[
                    'emily.chen@acme.com',
                    'marcus.johnson@acme.com',
                    'aria.nakamura@acme.com'
                  ].map((email) => (
                    <button
                      key={email}
                      className="group/copy relative w-full text-left"
                      title="Click to copy email"
                      onClick={() => navigator.clipboard.writeText(email)}
                    >
                      <code className="block px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer w-full">
                        {email}
                      </code>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Click to copy
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password:</span>
                  <button
                    className="group/copy relative"
                    title="Click to copy password"
                    onClick={() => navigator.clipboard.writeText('demo123')}
                  >
                    <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer">
                      demo123
                    </code>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/copy:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Click to copy
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-orange-600 dark:text-orange-400">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Complete interactive tasks
                </div>
                <div className="flex items-center text-sm text-cyan-600 dark:text-cyan-400">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  Chat with AI assistant
                </div>
                <div className="flex items-center text-sm text-pink-600 dark:text-pink-400">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Track progress & achievements
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Try Employee Demo →
                </button>
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Click the <strong className="text-[#e99f75]">Sign In</strong> button in the navigation bar to get started!
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>🔒</span>
              <span>All demo data is temporary and resets automatically</span>
            </div>
          </div>
        </div>

        <DemoCarousel />

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e99f75] dark:text-[#e99f75] mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">50K+</div>
              <div className="text-gray-600 dark:text-gray-300">New Hires</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">85%</div>
              <div className="text-gray-600 dark:text-gray-300">Faster Onboarding</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">4.9/5</div>
              <div className="text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-[#e99f75] dark:text-[#e99f75] font-bold">SJ</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">HR Director, TechCorp</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Buddy reduced our onboarding time by 60%. Our new hires are productive from day one!"
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-400 font-bold">MR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Mike Rodriguez</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Engineering Manager, StartupXYZ</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "The AI assistant is incredible. It answers questions instantly and guides through every step."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold">AC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">Anna Chen</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">New Hire, InnovateCo</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "Best onboarding experience ever! Buddy made everything so simple and welcoming."
              </p>
              <div className="flex text-yellow-400 mt-4">
                <span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span><span>⭐</span>
      </div>
            </div>
          </div>

          {/* Demo CTA */}
          <div className="text-center">
            <button
              onClick={() => setShowLoginModal(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#e99f75] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Try Demo Now
              <ArrowRight className="w-6 h-6 ml-3" />
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
              No credit card required • Free 14-day trial
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Footer Content */}
          <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                {/* Consistent Robot Logo */}
                <div className="w-10 h-10 flex items-center justify-center mr-3">
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-sm"
                  >
                    <rect
                      x="8"
                      y="12"
                      width="24"
                      height="20"
                      rx="8"
                      fill="url(#footerRobotGradient)"
                      stroke="url(#footerRobotBorder)"
                      strokeWidth="2"
                    />
                    <circle cx="16" cy="18" r="3" fill="white" opacity="0.9" />
                    <circle cx="24" cy="18" r="3" fill="white" opacity="0.9" />
                    <circle cx="16" cy="18" r="1.5" fill="#e99f75" />
                    <circle cx="24" cy="18" r="1.5" fill="#e99f75" />
                    <path
                      d="M 14 24 Q 20 28 26 24"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <line x1="20" y1="12" x2="20" y2="8" stroke="#e99f75" strokeWidth="2" />
                    <circle cx="20" cy="6" r="2" fill="#e99f75" />
                    <defs>
                      <linearGradient id="footerRobotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e99f75" />
                        <stop offset="100%" stopColor="#f4a261" />
                      </linearGradient>
                      <linearGradient id="footerRobotBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#d97706" />
                        <stop offset="100%" stopColor="#ea580c" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Buddy</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Streamlining employee onboarding with AI-powered assistance for modern workplaces.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Pricing</a></li>
                <li><a href="#security" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Security</a></li>
                <li><a href="#integrations" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Integrations</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">About Us</a></li>
                <li><a href="#careers" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Careers</a></li>
                <li><a href="#blog" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Blog</a></li>
                <li><a href="#press" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Press</a></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#help" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Help Center</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Contact Us</a></li>
                <li><a href="#privacy" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#terms" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Social Proof & Awards */}
          <div className="py-8 border-t border-gray-800">
            <div className="text-center mb-6">
              <p className="text-gray-400 text-sm mb-4">Featured in</p>
              <div className="flex items-center justify-center space-x-8 opacity-70">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">TC</span>
                  </div>
                  <span className="text-gray-300 text-sm">TechCrunch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">FR</span>
                  </div>
                  <span className="text-gray-300 text-sm">Forrester</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">HR</span>
                  </div>
                  <span className="text-gray-300 text-sm">HR Today</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xs">🏆</span>
                  </div>
                  <span className="text-gray-300 text-sm">Best in HR Tech 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced CTA Banner */}
          <div className="py-8 border-t border-gray-800 bg-gradient-to-r from-gray-800/50 to-gray-900/50">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-6 sm:mb-0 text-center sm:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">
                  Ready to transform your onboarding?
                </h3>
                <p className="text-gray-300">
                  Join 500+ companies using Buddy to onboard 40% faster.
                </p>
                <div className="flex items-center justify-center sm:justify-start space-x-4 mt-3">
                  <div className="flex items-center text-green-400 text-sm">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    Free 14-day trial
                  </div>
                  <div className="flex items-center text-blue-400 text-sm">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                    No credit card required
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#e99f75] to-orange-600 hover:from-orange-700 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                  aria-label="Book a demo"
                >
                  🚀 Book a Demo
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="inline-flex items-center px-6 py-3 border-2 border-gray-600 hover:border-[#e99f75] text-gray-300 hover:text-[#e99f75] font-semibold rounded-lg transition-all duration-300 hover:shadow-lg"
                  aria-label="Start free trial"
                >
                  Start Free Trial
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="py-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">
              © 2024 Buddy Onboarding Hub. Powered by <span className="text-[#e99f75]">Zenafide</span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Privacy</a>
              <a href="#terms" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Terms</a>
              <a href="#cookies" className="text-gray-400 hover:text-[#e99f75] transition-colors duration-200">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={(role, userData) => { 
          login(role, userData); 
          setShowLoginModal(false); 
        }} 
      />
    </div>
  );
}