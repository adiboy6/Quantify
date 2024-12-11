// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, Users, BarChart } from "lucide-react";
import FpageImage from "./images/FpageImage.jpg";
import FpageImage2 from "./images/FpageImage2.png";

const features = [
  {
    icon: <CheckCircle className="w-6 h-6 text-green-500" />,
    title: "Discover Your Perfect Job Match",
    description:
      "Browse through thousands of job listings tailored to your career interests and professional skills",
  },
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: "Simplify Your Application Process",
    description:
      "Let us guide you through each step of your job applications, ensuring your skills and experiences are highlighted effectively.",
  },
  {
    icon: <BarChart className="w-6 h-6 text-purple-500" />,
    title: "Craft Cover Letters",
    description:
      "Generate personalized cover letters that capture your unique qualifications and enthusiasm for the role.",
  },
];

export function Home() {
  return (
    <div>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Land the Right Job
              <span className="text-blue-600"> Simple, Strategic</span>
            </h1>

            <p className="text-xl text-gray-600 leading-relaxed">
              From discovering tailored job opportunities to crafting standout
              applications and cover letters, we make every step towards your
              next job simpler and more effective.
            </p>

            <div className="flex items-center gap-4">
              <Link
                to="/create-account"
                className="bg-blue-600 text-white px-8 py-4 rounded-full inline-flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/learn-more"
                className="text-gray-600 hover:text-blue-600 px-8 py-4 rounded-full inline-flex items-center gap-2"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl p-8">
              <img
                src={FpageImage} // Update this path
                alt="Custom illustration"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Quantify?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the tools you need to succeed in your job search
              journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl">
                <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How it Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Simple steps to land your dream job into reality
          </p>
        </div>

        <div className="flex-col ml-24 align-items-center space-y-12">
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">1</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Your Account
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Share your interests and goals to tailor the job search
                experience to your career ambitions.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xl">2</span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Personalized Job Matches
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get job suggestions and easy-to-complete applications based on
                your skills and preferences.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="bg-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to land your dream job?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Your Next Opportunity, One Search Away
          </p>
          <Link
            to="/create-account"
            className="bg-white text-blue-600 px-8 py-4 rounded-full hover:bg-blue-50 transition-colors inline-flex items-center gap-2 text-lg font-medium"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div> */}
    </div>
  );
}

export default Home;
