'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Code,
  GitBranch,
  Users,
  Zap,
  Heart,
  BookOpen,
  Bug,
  Lightbulb,
  ExternalLink,
  Github,
  MessageSquare,
  Award,
  Rocket,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const sections = [
  { id: 'why', label: 'Why Contribute' },
  { id: 'ways', label: 'Ways to Contribute' },
  { id: 'started', label: 'Getting Started' },
  { id: 'tech', label: 'Tech Stack' },
  { id: 'community', label: 'Community' },
  { id: 'impact', label: 'Your Impact' },
]

export default function ContributePage() {
  const [activeSection, setActiveSection] = useState('why')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-20% 0px -80% 0px' }
    )

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 dark:from-violet-950/20 dark:via-background dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex gap-8">
          {/* Table of Contents - Desktop Only */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20 space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                On This Page
              </p>
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={cn(
                    'block w-full text-left text-sm py-1.5 px-3 rounded-md transition-colors',
                    activeSection === id
                      ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-900 dark:text-violet-300 font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 max-w-3xl">
            {/* Header */}
            <div className="text-center mb-10 space-y-3">
              <Badge variant="outline" className="mb-2 text-xs">
                Open Source • Community Driven
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Build the Future of
                <br />
                <span className="relative inline-block pb-2">
                  <span className="relative z-10">Corporate Accountability</span>
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-violet-200 to-blue-300 dark:from-violet-600/40 dark:to-blue-500/40 -z-0"
                    style={{
                      transform: 'scaleX(1)',
                      transformOrigin: 'left'
                    }}
                  />
                </span>
              </h1>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Join developers, data scientists, and activists building the world's most comprehensive platform for tracking corporate DEI commitments and accountability.
              </p>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <a
                  href="https://github.com/measurelabs/corporate-dei-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 dark:bg-violet-700 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-all hover:scale-105"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                </a>
                <a
                  href="https://github.com/measurelabs/corporate-dei-tracker/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 dark:bg-gray-700 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-all hover:scale-105"
                >
                  <Bug className="h-4 w-4" />
                  Report Issue
                </a>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:bg-accent text-foreground rounded-lg text-sm font-medium transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  API Docs
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <Code className="h-8 w-8 text-violet-600 dark:text-violet-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">100% Open</div>
                  <div className="text-xs text-muted-foreground">Source Code</div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">Growing</div>
                  <div className="text-xs text-muted-foreground">Community</div>
                </CardContent>
              </Card>
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6 text-center">
                  <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold mb-1">High Impact</div>
                  <div className="text-xs text-muted-foreground">Public Good</div>
                </CardContent>
              </Card>
            </div>

            {/* Why Contribute */}
            <section id="why" className="mb-12 scroll-mt-20">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                    Why Contribute to MEASURE Labs?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      <strong className="text-foreground">Make a Real-World Impact:</strong> Your code helps journalists, activists, investors, and the public hold corporations accountable for their DEI commitments.
                    </p>
                    <p>
                      <strong className="text-foreground">Build Your Portfolio:</strong> Work on a production system used by real users, with modern tech stack and best practices.
                    </p>
                    <p>
                      <strong className="text-foreground">Learn and Grow:</strong> Gain experience with Next.js 14+, FastAPI, data engineering, and full-stack development.
                    </p>
                    <p>
                      <strong className="text-foreground">Join a Mission:</strong> Be part of a community building tools for transparency and corporate accountability.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Ways to Contribute */}
            <section id="ways" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Rocket className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                Ways to Contribute
              </h2>
              <div className="grid gap-4">
                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Code className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      Frontend Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Help improve the user interface and experience:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Build new visualizations and dashboards</li>
                      <li>Improve responsive design and accessibility</li>
                      <li>Add interactive features and animations</li>
                      <li>Optimize performance and loading times</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">Next.js 14+</Badge>
                      <Badge variant="outline" className="text-xs">React 19</Badge>
                      <Badge variant="outline" className="text-xs">Tailwind CSS</Badge>
                      <Badge variant="outline" className="text-xs">TypeScript</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      Backend Development
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Enhance the API and data processing:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Add new API endpoints and features</li>
                      <li>Improve data validation and error handling</li>
                      <li>Optimize database queries and indexing</li>
                      <li>Build data scraping and ingestion pipelines</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">FastAPI</Badge>
                      <Badge variant="outline" className="text-xs">Python</Badge>
                      <Badge variant="outline" className="text-xs">PostgreSQL</Badge>
                      <Badge variant="outline" className="text-xs">SQLAlchemy</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-green-300 dark:hover:border-green-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
                      Data & Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Help us track and verify corporate DEI data:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Research and add new companies</li>
                      <li>Verify and update existing data</li>
                      <li>Build data quality tools</li>
                      <li>Create automation for data collection</li>
                    </ul>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">Data Analysis</Badge>
                      <Badge variant="outline" className="text-xs">Research</Badge>
                      <Badge variant="outline" className="text-xs">Web Scraping</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-orange-300 dark:hover:border-orange-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Improve documentation and learning resources:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Write tutorials and guides</li>
                      <li>Improve API documentation</li>
                      <li>Create video walkthroughs</li>
                      <li>Translate documentation</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-red-300 dark:hover:border-red-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bug className="h-5 w-5 text-red-600 dark:text-red-400" />
                      Bug Hunting & Testing
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Help us maintain quality and reliability:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Find and report bugs</li>
                      <li>Write unit and integration tests</li>
                      <li>Perform security audits</li>
                      <li>Test on different devices and browsers</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-border bg-card/50 backdrop-blur-sm hover:border-yellow-300 dark:hover:border-yellow-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                      Feature Ideas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>Share your ideas for new features:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Propose new visualizations</li>
                      <li>Suggest UX improvements</li>
                      <li>Design new data models</li>
                      <li>Brainstorm analytics features</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Getting Started */}
            <section id="started" className="mb-12 scroll-mt-20">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Fork the Repository</h3>
                        <p className="text-sm text-muted-foreground">
                          Visit our <a href="https://github.com/measurelabs/corporate-dei-tracker" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">GitHub repo</a> and click the "Fork" button.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Set Up Locally</h3>
                        <p className="text-sm text-muted-foreground mb-2">Clone and install dependencies:</p>
                        <div className="bg-muted/50 p-3 rounded text-xs font-mono overflow-x-auto">
                          git clone https://github.com/YOUR_USERNAME/corporate-dei-tracker.git<br />
                          cd corporate-dei-tracker<br />
                          npm install<br />
                          npm run dev
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Find an Issue</h3>
                        <p className="text-sm text-muted-foreground">
                          Check our <a href="https://github.com/measurelabs/corporate-dei-tracker/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 hover:underline">"good first issue"</a> label for beginner-friendly tasks.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-300 font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">Create a Pull Request</h3>
                        <p className="text-sm text-muted-foreground">
                          Make your changes, commit them, and submit a PR. We'll review and provide feedback!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-300">
                      <strong>New to open source?</strong> Don't worry! We welcome first-time contributors and provide mentorship. Check out our <a href="https://github.com/measurelabs/corporate-dei-tracker/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="underline">Contributing Guide</a> for detailed instructions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Tech Stack */}
            <section id="tech" className="mb-12 scroll-mt-20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Code className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                Tech Stack
              </h2>
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Frontend</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="blue">Next.js 14+</Badge>
                      <Badge variant="blue">React 19</Badge>
                      <Badge variant="blue">TypeScript 5</Badge>
                      <Badge variant="blue">Tailwind CSS</Badge>
                      <Badge variant="blue">Radix UI</Badge>
                      <Badge variant="blue">Recharts</Badge>
                      <Badge variant="blue">Sanity CMS</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Backend</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="green">FastAPI</Badge>
                      <Badge variant="green">Python 3.11+</Badge>
                      <Badge variant="green">PostgreSQL</Badge>
                      <Badge variant="green">SQLAlchemy</Badge>
                      <Badge variant="green">Pydantic</Badge>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Infrastructure</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="gray">Docker</Badge>
                      <Badge variant="gray">GitHub Actions</Badge>
                      <Badge variant="gray">Vercel</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Community */}
            <section id="community" className="mb-12 scroll-mt-20">
              <Card className="border-border bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Join Our Community
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Connect with other contributors, get help, and stay updated:
                  </p>
                  <div className="grid gap-3">
                    <a
                      href="https://github.com/measurelabs/corporate-dei-tracker/discussions"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                    >
                      <MessageSquare className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">GitHub Discussions</div>
                        <div className="text-xs text-muted-foreground">Ask questions and share ideas</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                    <a
                      href="https://github.com/measurelabs/corporate-dei-tracker/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                    >
                      <Bug className="h-5 w-5 text-red-600 dark:text-red-400" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">Issue Tracker</div>
                        <div className="text-xs text-muted-foreground">Report bugs and request features</div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Your Impact */}
            <section id="impact" className="mb-12 scroll-mt-20">
              <Card className="border-border bg-gradient-to-br from-violet-50 to-blue-50 dark:from-violet-950/20 dark:to-blue-950/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    Your Impact Matters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Every contribution to MEASURE Labs has a ripple effect:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-violet-600 dark:text-violet-400">•</span>
                      <span><strong className="text-foreground">Journalists</strong> use our data to investigate corporate claims and hold companies accountable</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-600 dark:text-blue-400">•</span>
                      <span><strong className="text-foreground">Activists</strong> track commitments and organize campaigns based on verified data</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-600 dark:text-green-400">•</span>
                      <span><strong className="text-foreground">Investors</strong> make informed decisions about corporate ESG practices</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-orange-600 dark:text-orange-400">•</span>
                      <span><strong className="text-foreground">The Public</strong> gains transparency into corporate behavior and broken promises</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-4 bg-white dark:bg-gray-900/50 rounded-lg border border-violet-200 dark:border-violet-800">
                    <p className="text-sm font-medium text-violet-900 dark:text-violet-300">
                      "By contributing to MEASURE Labs, you're not just writing code—you're building infrastructure for accountability and transparency that the world desperately needs."
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* CTA */}
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Join us in building the infrastructure for corporate accountability. Your first contribution is just a click away.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href="https://github.com/measurelabs/corporate-dei-tracker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 dark:bg-violet-700 hover:opacity-90 text-white rounded-lg font-medium transition-all hover:scale-105"
                >
                  <Github className="h-5 w-5" />
                  Start Contributing
                </a>
                <a
                  href="https://github.com/measurelabs/corporate-dei-tracker/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-accent text-foreground rounded-lg font-medium transition-colors"
                >
                  <Lightbulb className="h-5 w-5" />
                  Find an Issue
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
