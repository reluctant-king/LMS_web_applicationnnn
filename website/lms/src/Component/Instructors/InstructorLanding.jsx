import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AllCourseDetail } from '../AllCourseContext/Context';
import { 
  FaPlus, FaUsers, FaClipboardList,
  FaArrowRight, FaStar, FaRocket, FaLightbulb, FaChartLine,
  FaPlay, FaCheckCircle, FaGraduationCap, FaVideo, FaComments
} from 'react-icons/fa';
import { BookOpen, FileText, HelpCircle, Sparkles, Zap, Trophy, Target, Layers } from 'lucide-react';

const InstructorLanding = () => {
  const { user } = useContext(AllCourseDetail);

  const getFirstName = () => {
    if (!user) return 'Instructor';
    if (user.name) return user.name.split(' ')[0];
    if (user.email) return user.email.split('@')[0];
    return 'Instructor';
  };

  const features = [
    {
      icon: FaVideo,
      title: 'Easy Course Builder',
      description: 'Drag-and-drop interface to create stunning courses in minutes',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: FaUsers,
      title: 'Global Reach',
      description: 'Connect with thousands of eager learners worldwide',
      color: 'from-cyan-500 to-blue-600',
    },
    {
      icon: FaChartLine,
      title: 'Real-time Analytics',
      description: 'Track student progress and earnings with detailed insights',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: FaComments,
      title: 'Engage Students',
      description: 'Built-in Q&A, discussions, and feedback tools',
      color: 'from-emerald-500 to-teal-600',
    },
  ];

  const actionCards = [
    {
      title: 'Create Course',
      subtitle: 'Start from scratch',
      icon: FaPlus,
      to: '/create_course',
      bg: 'bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700',
      pattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    },
    {
      title: 'My Courses',
      subtitle: 'Manage & edit',
      icon: BookOpen,
      to: '/my_courses',
      bg: 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600',
      pattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    },
    {
      title: 'Quiz Manager',
      subtitle: 'Create assessments',
      icon: FileText,
      to: '/instructor_quiz_manager',
      bg: 'bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500',
      pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    },
    {
      title: 'Get Help',
      subtitle: 'Support & FAQs',
      icon: HelpCircle,
      to: '/help',
      bg: 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800',
      pattern: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
    },
  ];

  const testimonials = [
    {
      quote: "I've earned over $50,000 teaching what I love. The platform makes it incredibly easy.",
      author: "Sarah Chen",
      role: "Web Development Instructor",
      avatar: "SC",
    },
    {
      quote: "From 0 to 5,000 students in 6 months. The tools here are simply amazing.",
      author: "Marcus Johnson",
      role: "Data Science Expert",
      avatar: "MJ",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[250px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[350px] lg:h-[500px] bg-purple-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[250px] sm:w-[350px] lg:w-[500px] h-[250px] sm:h-[350px] lg:h-[500px] bg-cyan-600/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] lg:w-[800px] h-[400px] sm:h-[600px] lg:h-[800px] bg-indigo-600/10 rounded-full blur-[100px] sm:blur-[120px] lg:blur-[150px]"></div>
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section - Split Layout */}
        <section className="min-h-[85vh] sm:min-h-[90vh] flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-20 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6 sm:mb-8">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
                  <span className="text-xs sm:text-sm text-slate-300">Instructor Portal</span>
                </div>

                <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] mb-4 sm:mb-6">
                  <span className="text-white">Teach.</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Inspire.
                  </span>
                  <br />
                  <span className="text-white">Earn.</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-slate-400 leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-lg mx-auto lg:mx-0">
                  Hey <span className="text-white font-semibold">{getFirstName()}</span>! 
                  Turn your expertise into income. Create courses that impact thousands of lives.
                </p>

                <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    to="/create_course"
                    className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-white text-slate-900 font-bold text-sm sm:text-base rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <FaRocket className="text-sm sm:text-base group-hover:rotate-12 transition-transform" />
                      Start Creating
                    </span>
                  </Link>
                  
                  <Link
                    to="/my_courses"
                    className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-6 lg:px-8 py-3 sm:py-3.5 lg:py-4 border-2 border-white/20 text-white font-semibold text-sm sm:text-base rounded-full hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                  >
                    <FaPlay className="text-xs sm:text-sm" />
                    View My Courses
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 border-t border-white/10">
                  {[
                    { value: '50K+', label: 'Instructors' },
                    { value: '2M+', label: 'Students' },
                    { value: '$10M+', label: 'Paid Out' },
                  ].map((stat, idx) => (
                    <div key={idx} className="text-center lg:text-left">
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-slate-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Interactive Cards */}
              <div className="relative mt-8 lg:mt-0">
                {/* Floating Elements - Hidden on very small screens */}
                <div className="hidden sm:block absolute -top-6 lg:-top-10 -left-6 lg:-left-10 w-14 lg:w-20 h-14 lg:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl rotate-12 opacity-60 blur-sm"></div>
                <div className="hidden sm:block absolute -bottom-6 lg:-bottom-10 -right-6 lg:-right-10 w-20 lg:w-32 h-20 lg:h-32 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-40 blur-lg"></div>

                {/* Main Card Grid */}
                <div className="grid grid-cols-2 gap-2.5 xs:gap-3 sm:gap-4">
                  {actionCards.map((card, idx) => (
                    <Link
                      key={idx}
                      to={card.to}
                      className={`group relative ${card.bg} rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 overflow-hidden transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl`}
                      style={{ backgroundImage: card.pattern }}
                    >
                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      </div>

                      <div className="relative z-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                          <card.icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1">{card.title}</h3>
                        <p className="text-xs sm:text-sm text-white/70">{card.subtitle}</p>
                        <FaArrowRight className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 text-white/50 text-xs sm:text-sm group-hover:text-white group-hover:translate-x-1 transition-all" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Horizontal Scroll Feel */}
        <section className="py-12 sm:py-16 lg:py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <span className="inline-flex items-center gap-2 text-cyan-400 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                POWERFUL FEATURES
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                Everything you need to succeed
              </h2>
              <p className="text-slate-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                Our platform provides all the tools you need to create, publish, and grow your online teaching business.
              </p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 sm:mb-5 lg:mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Timeline Style */}
        <section className="py-12 sm:py-16 lg:py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <span className="inline-flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                HOW IT WORKS
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Three steps to success
              </h2>
            </div>

            <div className="relative">
              {/* Connection Line - Hidden on mobile */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-emerald-500"></div>

              {/* Vertical Line for Mobile/Tablet */}
              <div className="lg:hidden absolute left-[27px] xs:left-[31px] sm:left-[35px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-purple-500 via-cyan-500 to-emerald-500"></div>

              <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                {[
                  {
                    step: '01',
                    title: 'Plan Your Course',
                    description: 'Outline your curriculum, define learning objectives, and structure your content for maximum impact.',
                    icon: FaLightbulb,
                    color: 'from-purple-500 to-violet-600',
                  },
                  {
                    step: '02',
                    title: 'Create & Upload',
                    description: 'Record videos, add quizzes, upload resources. Our tools make content creation a breeze.',
                    icon: Layers,
                    color: 'from-cyan-500 to-blue-600',
                  },
                  {
                    step: '03',
                    title: 'Publish & Earn',
                    description: 'Launch your course to our global audience and start earning from day one.',
                    icon: Trophy,
                    color: 'from-emerald-500 to-teal-600',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative flex lg:block gap-4 sm:gap-5 lg:gap-0">
                    {/* Step Number Circle */}
                    <div className="flex-shrink-0 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-10">
                      <div className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-2xl shadow-purple-500/30`}>
                        <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className={`flex-1 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 ${idx === 1 ? 'lg:mt-32' : 'lg:mt-0'}`}>
                      <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white/5">{item.step}</span>
                      <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mt-2 sm:mt-3 lg:mt-4 mb-2 sm:mb-3">{item.title}</h3>
                      <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12 sm:py-16 lg:py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <span className="inline-flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                <FaStar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                SUCCESS STORIES
              </span>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-white px-4">
                Join thousands of successful instructors
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-0.5 sm:gap-1 mb-4 sm:mb-5 lg:mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar key={star} className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed mb-5 sm:mb-6 lg:mb-8">"{item.quote}"</p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm sm:text-base">
                      {item.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm sm:text-base">{item.author}</p>
                      <p className="text-xs sm:text-sm text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 p-6 sm:p-10 lg:p-12 xl:p-20">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 right-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-white/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
              </div>

              <div className="relative z-10 text-center">
                <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-5 lg:mb-6">
                  Ready to start teaching?
                </h2>
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-white/80 mb-6 sm:mb-8 lg:mb-10 max-w-2xl mx-auto px-2">
                  Join our community of expert instructors and start making an impact today.
                </p>
                <Link
                  to="/create_course"
                  className="inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-purple-600 font-bold text-sm sm:text-base lg:text-lg rounded-full hover:scale-105 hover:shadow-2xl transition-all duration-300"
                >
                  <FaGraduationCap className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  <span className="whitespace-nowrap">Create Your First Course</span>
                  <FaArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </Link>

                <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8 lg:mt-10">
                  {[
                    'No upfront costs',
                    'Keep 70% revenue',
                    'Instant publishing',
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 sm:gap-2 text-white/80">
                      <FaCheckCircle className="text-emerald-400 text-xs sm:text-sm" />
                      <span className="text-xs sm:text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Spacer */}
        <div className="h-10 sm:h-16 lg:h-20"></div>
      </div>
    </div>
  );
};

export default InstructorLanding;