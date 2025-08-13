import { Shield, Users, Target, Award } from 'lucide-react';

function About() {
  const team = [
    {
      name: "Abd-ul-ala Taha",
      role: "Team Lead",
      image: "https://i.postimg.cc/ncvrcvcW/9aa183b4-c593-41c2-aade-babc74b76883.jpg?w=400&auto=format&fit=crop",
      description: "BSc. in Computer Science, Full Stack Developer, leading our AI development team."
    },
    {
      name: "Farhad Ali",
      role: "ML & DL Engineer",
      image: "https://i.postimg.cc/tgphSYNx/farhad-image.jpg",
      description: "Expertise in Computer Vision."
    },
    {
      name: "Nida Mohsin",
      role: "Product Director",
      image: "https://i.postimg.cc/wyNCcGCQ/7e30e875-51ef-43ad-b091-99670aed91c5.jpg",
      description: "Expertise in Project Management."
    },
    {
      name: "Ayesha Yousaf",
      role: "Research Head",
      image: "https://i.postimg.cc/wyNCcGCQ/7e30e875-51ef-43ad-b091-99670aed91c5.jpg",
      description: "Expertise in ML"
    }
  ];

  const values = [
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Integrity",
      description: "We maintain the highest standards of honesty and ethical behavior in all our operations."
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Collaboration",
      description: "We work together with our users and partners to create better solutions."
    },
    {
      icon: <Target className="h-8 w-8 text-indigo-600" />,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible in deepfake detection."
    },
    {
      icon: <Award className="h-8 w-8 text-indigo-600" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our service and technology."
    }
  ];

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">About FauxShield</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're on a mission to protect digital truth in an era of advancing AI technology.
              Our team combines expertise in artificial intelligence, digital forensics, and
              user experience design to create the most effective deepfake detection platform.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition">
                <div className="mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-indigo-600 mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-300">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  year: "2024",
                  title: "FauxShield Founded",
                  description: "Started with a vision to combat the rising threat of deepfakes."
                },
                {
                  year: "2025",
                  title: "Launch of Core Technology",
                  description: "Released our first AI-powered deepfake detection system."
                },
                {
                  year: "2025",
                  title: "Launch Publicly",
                  description: "Expanded our services and partnered with leading tech companies."
                }
              ].map((event, index) => (
                <div key={index} className="relative pl-8 border-l-2 border-indigo-200 dark:border-indigo-400">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 bg-indigo-600 rounded-full" />
                  <div className="mb-1 text-sm text-indigo-600 font-semibold">{event.year}</div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{event.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
