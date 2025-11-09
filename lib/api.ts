// Use Next.js API route proxy to keep API key server-side
const USE_PROXY = process.env.NEXT_PUBLIC_USE_API_PROXY !== 'false' // default to true
const API_BASE_URL = USE_PROXY ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000')
const API_VERSION = USE_PROXY ? '' : 'v1' // Proxy already includes version

export interface Company {
  id: string
  name: string
  ticker: string
  cik?: string | null
  industry: string | null
  hq_city?: string | null
  hq_state?: string | null
  hq_country: string | null
  employee_count?: number | null
  revenue_usd?: number | null
  logo_url?: string | null
  website?: string | null
  created_at: string
  updated_at: string
  profile_id?: string
  has_profile?: boolean
  source_count?: number
  // Lightweight profile summary fields for badges
  dei_status?: string | null
  risk_level?: string | null
  commitment_strength_rating?: number | null
  transparency_rating?: number | null
  recommendation?: string | null
}

export interface Profile {
  id: string
  company_id: string
  research_captured_at: string
  source_count: number
  overall_stance: string | null
  key_actions: string[] | null
  notable_leaders: string[] | null
  recent_changes: string | null
  created_at: string
  updated_at: string
}

export interface DEIPosture {
  status: string
  evidence_summary?: string | null
  last_verified_date?: string | null
  quotes?: string[] | null
  provenance_ids?: string[] | null
}

export interface FullProfile extends Profile {
  company: Company
  commitments?: Commitment[]
  controversies?: Controversy[]
  events?: Event[]
  sources?: DataSource[]  // API returns 'sources'
  data_sources?: DataSource[]  // Fallback for compatibility
  cdo_roles?: CDORole[]
  cdo_role?: CDORole
  risk_assessments?: RiskAssessment[]
  risk_assessment?: RiskAssessment
  ai_contexts?: AIContext[]
  ai_context?: AIContext
  dei_posture?: DEIPosture
  supplier_diversity?: SupplierDiversity
  key_insights?: any[]
  strategic_implications?: any[]
  commitment_count?: number
  controversy_count?: number
  event_count?: number
}

export interface Commitment {
  id: string
  profile_id: string
  commitment_name: string
  commitment_type: string
  current_status: string
  quotes?: string[] | null
  provenance_ids?: string[] | null
  status_changed_at?: string | null
  previous_status?: string | null
  created_at: string
  updated_at: string
  sources?: DataSource[]
}

export interface Controversy {
  id: string
  profile_id: string
  type: string
  status: string
  description: string
  case_name?: string | null
  docket_number?: string | null
  court?: string | null
  nlrb_case_id?: string | null
  filing_url?: string | null
  quotes?: string[] | null
  provenance_ids?: string[] | null
  status_standard?: string | null
  date?: string | null
  created_at: string
  updated_at: string
  sources?: DataSource[]
}

export interface Event {
  id: string
  profile_id: string
  date: string
  headline?: string | null
  event_type: string
  sentiment?: string | null
  impact?: string | null
  summary?: string | null
  quotes?: string[] | null
  provenance_ids?: string[] | null
  impact_magnitude?: string | null
  impact_direction?: string | null
  event_category?: string | null
  created_at: string
  updated_at: string
  company?: Company
  sources?: DataSource[]
}

export interface SupplierDiversity {
  profile_id: string
  program_exists: boolean
  program_status?: string | null
  spending_disclosed: boolean
  quotes?: string[] | null
  provenance_ids?: string[] | null
  created_at: string
  updated_at: string
  company?: Company
}

export interface DataSource {
  id: string
  profile_id: string
  source_type: string
  title: string
  url: string
  published_date: string | null
  reliability_score: number | null
  summary: string | null
  created_at: string
}

export interface CDORole {
  profile_id: string
  exists: boolean
  name: string | null
  title: string | null
  reports_to: string | null
  appointment_date: string | null
  c_suite_member: boolean
  quotes?: string[]
  provenance_ids?: string[]
}

export interface RiskAssessment {
  id: string
  profile_id: string
  overall_risk_score: number
  risk_level: string
  ongoing_lawsuits: number
  settled_cases: number
  negative_events: number
  assessment_notes: string | null
  assessed_at: string
  created_at: string
}

export interface AIContext {
  id: string
  profile_id: string
  executive_summary: string | null
  trend_analysis: string | null
  comparative_context: string | null
  commitment_strength_rating: number | null
  transparency_rating: number | null
  recommendation: string | null
  generated_at: string
  created_at: string
}

export interface AnalyticsOverview {
  total_companies: number
  total_profiles: number
  total_sources: number
  total_commitments: number
  total_controversies: number
  total_events: number
  avg_sources_per_company: number
  avg_commitments_per_company: number
  industries_covered: number
  countries_covered: number
  latest_research_date: string | null
  source_type_breakdown: Record<string, number>
  commitment_status_breakdown: Record<string, number>
  risk_level_breakdown: Record<string, number>
  recommendation_breakdown: Record<string, number>
  dei_status_breakdown: Record<string, number>
  transparency_distribution: Record<string, number>
}

export interface IndustryStats {
  industry: string
  company_count: number
  avg_sources: number
  avg_commitments: number
  total_commitments: number
  active_commitments: number
  total_controversies: number
  companies_with_cdo: number
}

export interface CompanyMetrics {
  source_count: number
  commitment_count: number
  active_commitments: number
  controversy_count: number
  event_count: number
  pledge_count: number
  industry_initiatives: number
  avg_source_reliability: number | null
  latest_research: string | null
  risk_score: number | null
  risk_level: string | null
  has_cdo: boolean
  transparency_rating: number | null
  commitment_strength_rating: number | null
  recommendation: string | null
}

export interface CompanyComparison {
  id: string
  name: string
  ticker: string
  industry: string | null
  metrics: CompanyMetrics
}

class APIClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_VERSION ? `${API_BASE_URL}/${API_VERSION}` : API_BASE_URL
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options?.headers,
    }

    // Add Next.js caching - cache for 5 minutes (300 seconds) by default
    const cacheOptions: RequestInit = {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      ...options,
      headers,
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, cacheOptions)

    if (!response.ok) {
      // Provide more detailed error messages for auth failures
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid or missing API key')
      }
      if (response.status === 403) {
        throw new Error('Forbidden: Insufficient permissions')
      }
      throw new Error(`API Error: ${response.statusText}`)
    }

    const data = await response.json()
    // Don't unwrap for paginated responses or responses with pagination key
    if (data.pagination || data.data) {
      return data
    }
    return data
  }

  // Companies
  async getCompanies(
    page = 1,
    perPage = 20,
    search?: string,
    industry?: string,
    country?: string,
    state?: string,
    sort?: string,
    order?: string
  ): Promise<{ data: Company[], total: number, page: number, per_page: number, total_pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    if (search) params.append('search', search)
    if (industry) params.append('industry', industry)
    if (country) params.append('country', country)
    if (state) params.append('state', state)
    if (sort) params.append('sort', sort)
    if (order) params.append('order', order)

    const response = await this.fetch<any>(`/companies/?${params}`)

    // Handle both response formats
    if (response.pagination) {
      return {
        data: response.data,
        total: response.pagination.total_count,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total_pages: response.pagination.total_pages
      }
    }

    return response
  }

  async getCompanyById(id: string): Promise<Company> {
    const response: any = await this.fetch(`/companies/${id}`)
    return response.data || response
  }

  async getCompanyByTicker(ticker: string): Promise<Company> {
    const response: any = await this.fetch(`/companies/ticker/${ticker}`)
    return response.data || response
  }

  async searchCompanies(query: string, industry?: string, country?: string): Promise<Company[]> {
    const params = new URLSearchParams({ q: query })
    if (industry) params.append('industry', industry)
    if (country) params.append('country', country)

    const response: any = await this.fetch(`/companies/search/advanced?${params}`)
    return response.data || response
  }

  async autocompleteCompanies(query: string, limit = 10): Promise<Company[]> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() })
    const response: any = await this.fetch(`/companies/search/autocomplete?${params}`)
    return response.data || response
  }

  async getFilterOptions(): Promise<{ industries: string[], countries: string[], states: string[] }> {
    const response: any = await this.fetch('/companies/filters/options', {
      next: { revalidate: 600 } // Cache for 10 minutes
    })
    return response.data || response
  }

  // Profiles
  async getProfiles(page = 1, perPage = 20): Promise<{ data: Profile[], total: number, page: number, per_page: number, total_pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    const response = await this.fetch<any>(`/profiles/?${params}`)

    if (response.pagination) {
      return {
        data: response.data,
        total: response.pagination.total_count,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total_pages: response.pagination.total_pages
      }
    }

    return response
  }

  async getProfileById(id: string): Promise<Profile> {
    const response: any = await this.fetch(`/profiles/${id}`)
    return response.data || response
  }

  async getFullProfile(id: string): Promise<FullProfile> {
    const response: any = await this.fetch(`/profiles/${id}/full`)
    return response.data || response
  }

  async getLatestProfileForCompany(companyId: string): Promise<FullProfile> {
    const response: any = await this.fetch(`/profiles/company/${companyId}/latest`)
    return response.data || response
  }

  async getAtRiskProfiles(limit = 20): Promise<FullProfile[]> {
    const response: any = await this.fetch(`/profiles/ranked/at-risk?limit=${limit}`)
    return response.data || response
  }

  async getTopCommittedProfiles(limit = 20): Promise<FullProfile[]> {
    const response: any = await this.fetch(`/profiles/ranked/top-committed?limit=${limit}`)
    return response.data || response
  }

  // Analytics
  async getAnalyticsOverview(): Promise<AnalyticsOverview> {
    const response: any = await this.fetch('/analytics/overview')
    return response.data || response
  }

  async getIndustryStats(): Promise<IndustryStats[]> {
    // Use longer cache for industry stats (10 minutes = 600 seconds)
    const response: any = await this.fetch('/analytics/industries', {
      next: { revalidate: 600 }
    })
    return response.data || response
  }

  async compareCompanies(companyIds: string[]): Promise<{ companies: CompanyComparison[], comparison_date: string }> {
    const params = companyIds.map(id => `company_ids=${id}`).join('&')
    const response: any = await this.fetch(`/analytics/compare?${params}`)
    return response.data || response
  }

  async getRiskDistribution(): Promise<any[]> {
    const response: any = await this.fetch('/analytics/risks')
    return response.data || response
  }

  // Commitments
  async getCommitments(page = 1, perPage = 20): Promise<{ data: Commitment[], total: number, page: number, per_page: number, total_pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    const response = await this.fetch<any>(`/commitments/?${params}`)

    if (response.pagination) {
      return {
        data: response.data,
        total: response.pagination.total_count,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total_pages: response.pagination.total_pages
      }
    }

    return response
  }

  async getCommitmentsByProfileId(profileId: string): Promise<Commitment[]> {
    const response: any = await this.fetch(`/commitments/profile/${profileId}`)
    return response.data || response
  }

  async getCommitmentById(id: string): Promise<Commitment> {
    const response: any = await this.fetch(`/commitments/${id}`)
    return response.data || response
  }

  // Controversies
  async getControversies(page = 1, perPage = 20): Promise<{ data: Controversy[], total: number, page: number, per_page: number, total_pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    const response = await this.fetch<any>(`/controversies/?${params}`)

    if (response.pagination) {
      return {
        data: response.data,
        total: response.pagination.total_count,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total_pages: response.pagination.total_pages
      }
    }

    return response
  }

  async getControversiesByProfileId(profileId: string): Promise<Controversy[]> {
    const response: any = await this.fetch(`/controversies/profile/${profileId}`)
    return response.data || response
  }

  async getControversyById(id: string): Promise<Controversy> {
    const response: any = await this.fetch(`/controversies/${id}`)
    return response.data || response
  }

  // Events
  async getEvents(
    page = 1,
    perPage = 20,
    filters?: {
      profile_id?: string
      company_id?: string
      event_type?: string
      sentiment?: string
      impact?: string
      impact_magnitude?: string
      impact_direction?: string
      event_category?: string
      search?: string
    }
  ): Promise<{ data: Event[], total: number, page: number, per_page: number, total_pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    if (filters?.profile_id) params.append('profile_id', filters.profile_id)
    if (filters?.company_id) params.append('company_id', filters.company_id)
    if (filters?.event_type) params.append('event_type', filters.event_type)
    if (filters?.sentiment) params.append('sentiment', filters.sentiment)
    if (filters?.impact) params.append('impact', filters.impact)
    if (filters?.impact_magnitude) params.append('impact_magnitude', filters.impact_magnitude)
    if (filters?.impact_direction) params.append('impact_direction', filters.impact_direction)
    if (filters?.event_category) params.append('event_category', filters.event_category)
    if (filters?.search) params.append('search', filters.search)

    const response = await this.fetch<any>(`/events/?${params}`)

    if (response.pagination) {
      return {
        data: response.data,
        total: response.pagination.total_count,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total_pages: response.pagination.total_pages
      }
    }

    return response
  }

  async getEventById(id: string): Promise<Event> {
    const response: any = await this.fetch(`/events/${id}`)
    return response.data || response
  }

  async getEventTypeStats(): Promise<any[]> {
    const response: any = await this.fetch('/events/types/stats')
    return response.data || response
  }

  // Supplier Diversity
  async getSupplierDiversity(
    page = 1,
    perPage = 20,
    filters?: {
      profile_id?: string
      company_id?: string
      program_exists?: boolean
      program_status?: string
      spending_disclosed?: boolean
    }
  ): Promise<{ data: SupplierDiversity[], total: number, page: number, per_page: number, total_pages: number }> {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    })
    if (filters?.profile_id) params.append('profile_id', filters.profile_id)
    if (filters?.company_id) params.append('company_id', filters.company_id)
    if (filters?.program_exists !== undefined) params.append('program_exists', filters.program_exists.toString())
    if (filters?.program_status) params.append('program_status', filters.program_status)
    if (filters?.spending_disclosed !== undefined) params.append('spending_disclosed', filters.spending_disclosed.toString())

    const response = await this.fetch<any>(`/supplier-diversity/?${params}`)

    if (response.pagination) {
      return {
        data: response.data,
        total: response.pagination.total_count,
        page: response.pagination.page,
        per_page: response.pagination.per_page,
        total_pages: response.pagination.total_pages
      }
    }

    return response
  }

  async getSupplierDiversityByProfile(profileId: string): Promise<SupplierDiversity> {
    const response: any = await this.fetch(`/supplier-diversity/${profileId}`)
    return response.data || response
  }

  async getSupplierDiversityStats(): Promise<any> {
    const response: any = await this.fetch('/supplier-diversity/stats/overview')
    return response.data || response
  }
}

export const api = new APIClient()
