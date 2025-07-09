import { TrendingDown, Eye, Shield } from "lucide-react"
import ScrollReveal, { StaggerContainer, StaggerItem } from "./ScrollReveal"

export default function PainPoints() {
  const painPoints = [
    {
      icon: TrendingDown,
      title: "Missing Opportunities",
      description: "Potential customers can't find you online, or when they do, your website doesn't convince them to take action",
      color: "text-purple-400"
    },
    {
      icon: Eye,
      title: "Low Visibility",
      description: "Your website isn't showing up in search results when people look for services like yours",
      color: "text-blue-400"
    },
    {
      icon: Shield,
      title: "Trust Concerns",
      description: "An outdated or unprofessional website makes visitors question your credibility and expertise",
      color: "text-violet-400"
    }
  ]

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              We Understand The Challenges
              <br />
              <span className="text-purple-400">You're Facing</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Running a business is tough enough without worrying about your website. 
              Let's talk about what might be holding your online presence back.
            </p>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {painPoints.map((point, index) => (
            <StaggerItem key={index}>
              <div className="modern-card p-8 h-full hover:transform hover:scale-[1.02] transition-all duration-200">
                <div className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-6`}>
                    <point.icon className={`w-8 h-8 ${point.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">{point.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{point.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal delay={0.2}>
          <div className="text-center">
            <div className="modern-card p-8 max-w-3xl mx-auto bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20">
              <p className="text-lg text-gray-300 mb-4 leading-relaxed">
                <span className="text-purple-400 font-semibold">Here's what we know:</span> Every day without an effective website 
                means missed opportunities to connect with customers who are actively looking for what you offer.
              </p>
              <p className="text-gray-400 leading-relaxed">
                The good news? We can fix this together and get your business the online presence it deserves.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}