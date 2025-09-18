import Image from "next/image";
import { getHealthcarePost, getFinancePost, getClimatePost } from "./lib/contentstack";

export default async function Home() {
  const [healthcarePost, financePost, climatePost] = await Promise.all([
    getHealthcarePost(),
    getFinancePost(),
    getClimatePost()
  ]);

  const blogSections = [
    {
      title: "Healthcare AI",
      description: "Discover how AI is revolutionizing patient care and medical diagnostics",
      post: healthcarePost,
      href: "/blog/classics",
      color: "from-blue-500 to-purple-500",
      bgColor: "from-blue-50 to-purple-50"
    },
    {
      title: "Finance AI", 
      description: "Explore AI applications in trading, fraud detection, and financial services",
      post: financePost,
      href: "/blog/live",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-50 to-emerald-50"
    },
    {
      title: "Climate AI",
      description: "Learn how AI is helping combat climate change and protect our environment",
      post: climatePost,
      href: "/blog/updates", 
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI Blog Hub
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-6">
          Exploring AI Across Industries
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Discover the latest insights, research, and applications of artificial intelligence 
          in healthcare, finance, and climate science.
        </p>
      </section>

      {/* Blog Sections */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogSections.map((section, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${section.bgColor} rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              <div className="p-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${section.color} rounded-full flex items-center justify-center mb-6`}>
                  <div className="text-white text-2xl font-bold">
                    {section.title.split(' ')[0].charAt(0)}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {section.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {section.description}
                </p>

                {section.post && (
                  <div className="bg-white/80 rounded-xl p-4 mb-6">
                    {section.post.image?.url && (
                      <Image
                        src={section.post.image.url}
                        alt={section.post.title}
                        width={400}
                        height={200}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">
                      {section.post.title}
                    </h4>
                    <p className="text-gray-600 text-xs">
                      By {section.post.author} • {section.post.category}
                    </p>
                  </div>
                )}

                <a
                  href={section.href}
                  className={`inline-block w-full text-center bg-gradient-to-r ${section.color} text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-300`}
                >
                  Read More →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600">
            © 2025 AI Blog Hub. Powered by Contentstack & Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
