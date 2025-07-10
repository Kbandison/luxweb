import { TrendingUp, Search, Star } from "lucide-react"

export default function Solutions() {
  const solutions = [
    {
      icon: TrendingUp,
      title: "Increase Revenue",
      description: "Turn 30% more website visitors into customers with clear calls-to-action",
      benefit: "More Sales",
      color: "text-green-400"
    },
    {
      icon: Search,
      title: "Boost Visibility",
      description: "Appear on Google's first page when customers search for your services",
      benefit: "More Traffic",
      color: "text-blue-400"
    },
    {
      icon: Star,
      title: "Build Credibility",
      description: "Look bigger and more professional than competitors",
      benefit: "More Trust",
      color: "text-amber-400"
    }
  ]

  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            How <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-indigo-400 bg-clip-text text-transparent">
              LuxWeb Studio
            </span> Solves This
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            We don't just build websites - we build revenue-generating machines that work 24/7 to grow your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="glass-card p-8 rounded-3xl glass-hover relative overflow-hidden group">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
              
              <div className="relative z-10">
                <div className="flex justify-start items-center gap-2">

                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black/50 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className={`w-8 h-8 ${solution.color}`} />
                </div>
                
                <div className={`inline-block px-4 py-2 rounded-xl text-2xl font-medium mb-6 ${solution.color} bg-current bg-opacity-20`}>
                  <div className="text-white">
                  {solution.benefit}
                  </div>
                </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-white mb-4">{solution.title}</h3>
                <p className="text-gray-400 text-lg leading-relaxed">{solution.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <div className="glass-card p-10 rounded-3xl max-w-4xl mx-auto">
            <h3 className="text-3xl font-semibold text-white mb-8">The Result?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-400 mb-3">3x</div>
                <div className="text-gray-300 text-lg">More Qualified Leads</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-400 mb-3">40%</div>
                <div className="text-gray-300 text-lg">Higher Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-400 mb-3">2x</div>
                <div className="text-gray-300 text-lg">Professional Credibility</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}