'use client'

import { useEffect, useState } from 'react'
import { api, AnalyticsOverview, IndustryStats } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, Building2, FileText, Target, AlertTriangle, Globe, Award, Eye, ShieldAlert } from 'lucide-react'

// Modern color palette inspired by Linear/Vercel
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316']
const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [industries, setIndustries] = useState<IndustryStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const [overviewData, industryData] = await Promise.all([
        api.getAnalyticsOverview(),
        api.getIndustryStats(),
      ])
      setOverview(overviewData || null)
      setIndustries(industryData || [])
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setOverview(null)
      setIndustries([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="space-y-8">
            {/* Header skeleton */}
            <div className="space-y-2">
              <div className="h-9 w-48 bg-muted rounded-md animate-pulse" />
              <div className="h-5 w-64 bg-muted/60 rounded-md animate-pulse" />
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-card border border-border rounded-md animate-pulse" />
              ))}
            </div>

            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-80 bg-card border border-border rounded-md animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-4 border-border">
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-12 h-12 mx-auto bg-muted rounded-md flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold">Unable to Load Analytics</h3>
              <p className="text-sm text-muted-foreground">We encountered an issue loading the analytics data. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Prepare data for charts
  const allSourceTypeData = Object.entries(overview.source_type_breakdown || {}).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
  })).sort((a, b) => b.value - a.value)

  // Keep top 7 sources and group the rest as "Other" for pie chart
  const topSourceCount = 7
  const topSources = allSourceTypeData.slice(0, topSourceCount)
  const otherSources = allSourceTypeData.slice(topSourceCount)
  const otherTotal = otherSources.reduce((sum, item) => sum + item.value, 0)

  const sourceTypeData = otherTotal > 0
    ? [...topSources, { name: 'Other', value: otherTotal }]
    : topSources

  // Keep top 15 for bar chart (can display more data than pie)
  const sourceTypeDataBar = allSourceTypeData.slice(0, 15)

  const commitmentStatusData = Object.entries(overview.commitment_status_breakdown || {}).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value,
  }))

  const riskLevelData = Object.entries(overview.risk_level_breakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  // Recommendation/Grade breakdown data
  const recommendationData = Object.entries(overview.recommendation_breakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
    value: Number(value),
  }))

  // DEI Status breakdown data
  const deiStatusData = Object.entries(overview.dei_status_breakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
    value: Number(value),
  }))

  // Transparency distribution data
  const transparencyData = Object.entries(overview.transparency_distribution || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number(value),
  }))

  const topIndustries = industries.slice(0, 10)

  // Prepare industry data for pie chart (top 8 industries + Other)
  const topIndustryCount = 8
  const topIndustriesForPie = industries.slice(0, topIndustryCount)
  const otherIndustries = industries.slice(topIndustryCount)
  const otherIndustryTotal = otherIndustries.reduce((sum, item) => sum + item.company_count, 0)

  const industryPieData = otherIndustryTotal > 0
    ? [...topIndustriesForPie.map(ind => ({ name: ind.industry, value: ind.company_count })), { name: 'Other', value: otherIndustryTotal }]
    : topIndustriesForPie.map(ind => ({ name: ind.industry, value: ind.company_count }))

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-sm text-muted-foreground">
            DEI trends and patterns across companies
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Companies Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Companies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {overview.total_companies.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview.industries_covered} industries
              </p>
            </CardContent>
          </Card>

          {/* Total Sources Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-foreground tabular-nums">
                {overview.total_sources.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview.avg_sources_per_company.toFixed(1)} avg per company
              </p>
            </CardContent>
          </Card>

          {/* Total Commitments Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Commitments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-green-600 dark:text-green-500 tabular-nums">
                {overview.total_commitments.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {overview.avg_commitments_per_company.toFixed(1)} avg per company
              </p>
            </CardContent>
          </Card>

          {/* Controversies Card */}
          <Card className="border-border bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                Controversies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-3xl font-bold text-red-600 dark:text-red-500 tabular-nums">
                {overview.total_controversies.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Across <span className="font-medium text-foreground">{overview.countries_covered}</span> countries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="sources" className="space-y-6">
          <TabsList className="inline-flex h-auto p-1 bg-muted border border-border rounded-md flex-wrap">
            <TabsTrigger value="sources" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              Source Types
            </TabsTrigger>
            <TabsTrigger value="commitments" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              Commitment Status
            </TabsTrigger>
            <TabsTrigger value="risks" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              Risk Levels
            </TabsTrigger>
            <TabsTrigger value="grade" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              Grade
            </TabsTrigger>
            <TabsTrigger value="dei-status" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              DEI Status
            </TabsTrigger>
            <TabsTrigger value="transparency" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              Transparency
            </TabsTrigger>
            <TabsTrigger value="industries" className="rounded px-3 py-1.5 text-sm font-medium data-[state=active]:bg-background">
              By Industry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold">Source Type Distribution</CardTitle>
                  <CardDescription className="text-xs">Breakdown of data sources by type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={sourceTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {sourceTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '16px'
                        }}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Source Types by Count</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Number of sources in each category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={sourceTypeDataBar}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                      />
                      <Bar dataKey="value" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="commitments" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Commitment Status Distribution</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Current status of DEI commitments</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={commitmentStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {commitmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '16px'
                        }}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Commitment Status by Count</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Number of commitments in each status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={commitmentStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                      />
                      <Bar dataKey="value" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="risks" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Risk Level Distribution</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Company risk assessment breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={riskLevelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {riskLevelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '16px'
                        }}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Risk Levels by Count</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Number of companies at each risk level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={riskLevelData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(239, 68, 68, 0.1)' }}
                      />
                      <Bar dataKey="value" fill={CHART_COLORS.danger} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grade" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Grade Distribution</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">AI recommendation grades across companies</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={recommendationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {recommendationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '16px'
                        }}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Grades by Count</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Number of companies in each grade</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={recommendationData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                      />
                      <Bar dataKey="value" fill={CHART_COLORS.secondary} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dei-status" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Current DEI Status</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Current state of DEI programs</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={deiStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {deiStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '16px'
                        }}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">DEI Status by Count</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Number of companies in each status</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={deiStatusData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="name"
                        angle={-30}
                        textAnchor="end"
                        height={80}
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                      />
                      <Bar dataKey="value" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transparency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Transparency Rating Distribution</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">How transparent companies are about DEI</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie
                        data={transparencyData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={0}
                        paddingAngle={2}
                      >
                        {transparencyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                          fontSize: '12px',
                          padding: '8px 12px'
                        }}
                        formatter={(value: number) => [value.toLocaleString(), 'Count']}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{
                          fontSize: '12px',
                          paddingTop: '16px'
                        }}
                        formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Transparency Levels by Count</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Companies at each transparency level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={transparencyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(6, 182, 212, 0.1)' }}
                      />
                      <Bar dataKey="value" fill={CHART_COLORS.info} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="industries" className="space-y-6">
            <Card className="border-border bg-card">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-base font-semibold">Top Industries by Company Count</CardTitle>
                <CardDescription className="text-xs">Industries with the most tracked companies</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={380}>
                  <PieChart>
                    <Pie
                      data={industryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={0}
                      paddingAngle={2}
                    >
                      {industryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                        fontSize: '12px',
                        padding: '8px 12px'
                      }}
                      formatter={(value: number) => [value.toLocaleString(), 'Companies']}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={48}
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{
                        fontSize: '12px',
                        paddingTop: '20px'
                      }}
                      formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">Average Sources by Industry</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Data coverage across industries</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={topIndustries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="industry"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                      />
                      <Bar dataKey="avg_sources" fill={CHART_COLORS.info} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-base font-semibold text-foreground">CDO Presence by Industry</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Companies with Chief Diversity Officers</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={topIndustries}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
                      <XAxis
                        dataKey="industry"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: 'rgb(100, 116, 139)', fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: 'rgb(100, 116, 139)', fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid rgba(226, 232, 240, 0.5)',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                      />
                      <Bar dataKey="companies_with_cdo" fill={CHART_COLORS.success} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Industry Stats Table */}
        <Card className="mt-12 border-border bg-card">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-base font-semibold">Industry Statistics</CardTitle>
            <CardDescription className="text-xs">Detailed breakdown of DEI metrics by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-md border border-border">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="text-left p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Industry</th>
                    <th className="text-right p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Companies</th>
                    <th className="text-right p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Avg Sources</th>
                    <th className="text-right p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Commitments</th>
                    <th className="text-right p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Active</th>
                    <th className="text-right p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">Controversies</th>
                    <th className="text-right p-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">CDO %</th>
                  </tr>
                </thead>
                <tbody>
                  {industries.map((industry, index) => (
                    <tr
                      key={index}
                      className="border-b border-border hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-3 font-medium text-foreground text-sm">{industry.industry}</td>
                      <td className="text-right p-3 tabular-nums text-sm">{industry.company_count}</td>
                      <td className="text-right p-3 tabular-nums text-sm">{industry.avg_sources.toFixed(1)}</td>
                      <td className="text-right p-3 tabular-nums text-sm">{industry.total_commitments}</td>
                      <td className="text-right p-3 tabular-nums text-sm">{industry.active_commitments}</td>
                      <td className="text-right p-3 tabular-nums text-sm">{industry.total_controversies}</td>
                      <td className="text-right p-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted border border-border tabular-nums">
                          {((industry.companies_with_cdo / industry.company_count) * 100).toFixed(0)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
