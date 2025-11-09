# MEASURE Labs' Corporate DEI Tracker

**Making Corporate Accountability Transparent and Accessible**

MEASURE Labs is an AI-powered intelligence platform that tracks corporate diversity, equity, and inclusion (DEI) commitments, controversies, and changes over time. We transform scattered information into verified, searchable data—empowering consumers, investors, advocates, journalists, and job seekers to make informed, values-aligned decisions.

🔗 **Live Platform**: [measurelabs.org](https://measurelabs.org)  
📊 **API Docs**: [measurelabs.org/api-docs](https://measurelabs.org/api-docs)  
📧 **Contact**: contribute@measurelabs.org

---

## Table of Contents

- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Who This Serves](#who-this-serves)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Overview](#api-overview)
- [Data Methodology](#data-methodology)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## The Problem

Companies make bold DEI commitments. Some follow through. Others scale back quietly, hoping no one notices. 

Until now, tracking who's actually committed versus who's just committed to the *appearance* of commitment required hours of research, legal expertise, and constant monitoring.

**The result?**
- Consumers lack the information to make values-aligned purchasing decisions
- Investors can't assess reputational risk and regulatory exposure
- Advocates struggle to hold companies systematically accountable  
- Job seekers can't evaluate whether companies' cultures match their promises
- Corporations face no pressure to maintain their commitments

---

## Our Solution

MEASURE Labs aggregates and verifies corporate DEI data from **360+ companies** across **11 industries**, synthesizing **3,486 data sources** and **1,101 commitments** into a single, searchable platform.

### We Track:

✅ **Public Commitments**  
CEO pledges, equity initiatives, coalition participation

🏢 **Structural Accountability**  
Chief Diversity Officers, executive compensation tied to DEI goals

📊 **Transparency Levels**  
How openly companies report progress (scored 0-10)

⚠️ **Risk Indicators**  
Lawsuits, controversies, policy reversals, scaling back

📈 **Industry Benchmarks**  
Comparative analysis across sectors and competitors

Our methodology combines **automated data collection** with **human verification**, assigning each company:
- **Commitment Strength Score** (0-10)
- **Transparency Rating** (0-10)  
- **Risk Assessment** (Low/Medium/High)
- **AI Executive Summary** synthesizing all data points

Updated continuously as new information emerges.

---

## Who This Serves

### 🛒 **Consumers**
Support companies that actually advance equity—not just those with the best PR.

### 💼 **Investors**  
Assess reputational risk, regulatory exposure, and ESG alignment.

### 📣 **Advocates & Nonprofits**
Track corporate accountability and identify targets for campaigns.

### 📰 **Journalists**
Investigate gaps between corporate rhetoric and action with verified sources.

### 👔 **HR Professionals & Job Seekers**
Evaluate whether companies' internal cultures match external promises.

---

## Key Features

### 🔍 **Comprehensive Company Profiles**
- AI-generated executive summaries
- Commitment tracking with status changes over time
- Controversy and lawsuit documentation with legal details
- CDO (Chief Diversity Officer) information and reporting structure
- Multi-source verification with reliability scores

### 📊 **Analytics Dashboard**
- Industry-wide trends and benchmarks
- Source type distribution analysis
- Commitment status breakdowns
- Risk level visualizations
- Filterable by sector, geography, and company size

### 🏭 **Industry Intelligence**
- Dedicated pages for 11+ industries
- Sector-specific challenges and opportunities
- Peer comparison tools
- Related industry cross-references

### 🔔 **Real-Time Monitoring** *(Coming Soon)*
- Alerts when companies change commitments
- Quarterly trend reports
- API webhooks for automated tracking

### 🌐 **Public API**
- RESTful API for developers, researchers, and journalists
- Comprehensive documentation
- Rate-limited free tier + premium access

---

## Tech Stack

### **Frontend**
- **Next.js 14** (React with App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Recharts** for data visualization
- **Radix UI** for accessibility

### **Backend**
- **Python 3.11+**
- **FastAPI** framework
- **PostgreSQL** database
- **SQLAlchemy** ORM
- **Alembic** for migrations
- **OpenAI API** for AI summaries

### **Infrastructure**
- **Docker** containerization
- **Vercel** frontend hosting
- **Railway/Render** backend hosting
- **Cloudflare** CDN + DDoS protection

---

## Getting Started

### Prerequisites
- **Node.js 18+**
- **Python 3.11+**  
- **PostgreSQL 14+**
- **Docker** (optional but recommended)

### Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/measurelabs/dei-tracker.git
cd dei-tracker

# Start all services
docker-compose up -d

# Access the platform
# Frontend: http://localhost:3000
# API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Manual Setup

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run migrations
alembic upgrade head

# Start the API server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

---

## Project Structure

```
measure-labs/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # App Router pages
│   │   ├── companies/       # Company detail pages
│   │   ├── industries/      # Industry overview pages
│   │   ├── analytics/       # Analytics dashboard
│   │   ├── search/          # Advanced search
│   │   └── about/           # About page
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   └── ...             # Custom components
│   ├── lib/                # Utilities and API client
│   └── public/             # Static assets
│
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── v1/         # API v1 endpoints
│   │   ├── core/           # Config, security, database
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry point
│   ├── alembic/            # Database migrations
│   ├── tests/              # Test suite
│   └── requirements.txt    # Python dependencies
│
├── scripts/                # Utility scripts
│   ├── data_collection/    # Web scrapers and data ingest
│   ├── data_processing/    # ETL pipelines
│   └── deployment/         # Deployment automation
│
├── docs/                   # Documentation
│   ├── api/               # API documentation
│   ├── methodology/        # Data methodology
│   └── contributing/       # Contribution guidelines
│
├── docker-compose.yml      # Docker orchestration
├── .github/               # GitHub Actions CI/CD
└── README.md              # This file
```

---

## API Overview

### Base URL
- **Production**: `https://api.measurelabs.org/v1`
- **Development**: `http://localhost:8000/v1`

### Key Endpoints

#### Companies
```http
GET    /v1/companies              # List all companies
GET    /v1/companies/{id}         # Get company by ID
GET    /v1/companies/search       # Search companies
POST   /v1/companies              # Add new company (admin)
```

#### Profiles
```http
GET    /v1/profiles/company/{id}/latest    # Latest company profile
GET    /v1/profiles/company/{id}/history   # Profile change history
```

#### Analytics
```http
GET    /v1/analytics/overview            # Platform-wide statistics
GET    /v1/analytics/industries          # Industry breakdowns
GET    /v1/analytics/trends              # Temporal trends
```

#### Industries
```http
GET    /v1/industries                    # List all industries
GET    /v1/industries/{slug}             # Get industry details
GET    /v1/industries/{slug}/companies   # Companies in industry
```

### Authentication
Public endpoints are rate-limited (100 requests/hour). Premium API access available for researchers and organizations.

**Full API Documentation**: [measurelabs.org/api-docs](https://measurelabs.org/api-docs)

---

## Data Methodology

### Data Collection

We aggregate data from multiple source types:

1. **Corporate Websites** - Official DEI pages, ESG reports, proxy statements
2. **Press Releases** - Company announcements, CEO statements  
3. **News Articles** - Verified journalism from reputable outlets
4. **Legal Filings** - SEC filings, court documents, settlement agreements
5. **Third-Party Reports** - Industry analyses, advocacy group research
6. **Regulatory Filings** - EEO-1 reports (when available)

### Source Verification

Each source is assigned a **reliability score** based on:
- Publisher credibility
- Recency of information
- Primary vs. secondary sourcing
- Corroboration across multiple sources

### Scoring System

**Commitment Strength (0-10)**
- 8-10: Strong, binding commitments with structural accountability
- 5-7: Moderate commitments with some transparency
- 2-4: Weak or vague commitments without accountability
- 0-1: No commitment or active scaling back

**Transparency (0-10)**  
- 8-10: Publicly reports detailed metrics, shares EEO-1 data
- 5-7: Publishes annual diversity reports with some metrics
- 2-4: Vague statements without data
- 0-1: No public information or actively opaque

**Risk Assessment**
- **Low**: No controversies, strong commitments, transparent reporting
- **Medium**: Minor controversies or mixed signals
- **High**: Active lawsuits, major controversies, or significant rollbacks

### AI Executive Summaries

Our AI system synthesizes all data points into natural language summaries using:
- GPT-4 for text generation
- Retrieval-augmented generation (RAG) for source grounding
- Human review for factual accuracy
- Clear attribution to prevent hallucination

**Important**: AI summaries always link to underlying sources. Users can verify claims directly.

---

## Contributing

MEASURE Labs is committed to transparency and community involvement. We welcome contributions from researchers, developers, journalists, and advocates.

### How to Contribute

#### 🔍 **Submit Company Data**
Found a commitment we missed? Identified a controversy? Email us:  
**contribute@measurelabs.org**

Include:
- Company name and ticker
- Type of information (commitment, controversy, source)
- URL or document reference
- Brief description

#### 💻 **Code Contributions**

1. **Fork the repository**
2. **Create a feature branch**  
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Write tests for new functionality
   - Follow existing code style (ESLint/Prettier for frontend, Black/Flake8 for backend)
   - Update documentation as needed
4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add industry comparison tool"
   ```
5. **Push and submit PR**
   ```bash
   git push origin feature/your-feature-name
   ```

#### 📊 **Research Collaboration**

Academic researchers, think tanks, and advocacy organizations: we provide:
- Full database exports for qualified research
- API credits for systematic analysis
- Co-publishing opportunities for findings

Contact: **contribute@measurelabs.org**

#### 📝 **Documentation**

Help improve our methodology docs, API guides, or user tutorials:
- Clarify confusing sections
- Add examples and use cases
- Translate into other languages

#### 🐛 **Bug Reports**

Found a bug? Open an issue:
- Describe what happened
- Include steps to reproduce
- Add screenshots if applicable
- Note your browser/environment

### Code of Conduct

We are committed to fostering an inclusive, respectful community. All contributors must:
- Treat others with respect
- Provide constructive feedback
- Focus on the work, not the person
- Accept accountability for mistakes

Violations can be reported to **contribute@measurelabs.org**

### Contribution Recognition

Significant contributors will be:
- Listed in our README
- Acknowledged in release notes
- Invited to our contributor Slack
- Eligible for MEASURE Labs swag

---

## Roadmap

### Q1 2025
- ✅ Launch v1.0 with 360+ companies
- ✅ Industry pages for 11 sectors
- ✅ Public API with documentation
- 🚧 Real-time alerts system
- 🚧 Historical trend analysis (5+ years)

### Q2 2025
- Expand to 500+ S&P 500 companies
- Add international companies (UK, EU, APAC)
- API webhooks for automated monitoring
- Mobile app (iOS/Android)
- Premium analytics dashboards

### Q3 2025
- Integration with ESG/CSR databases
- Supply chain DEI tracking
- Board diversity metrics
- Compensation equity analysis
- Partnership with advocacy organizations

### Q4 2025
- AI-powered predictive risk modeling
- Automated controversy detection
- Multi-language support
- Open-source data collection tools
- Annual "State of Corporate DEI" report

### Long-Term Vision

MEASURE Labs will expand beyond DEI tracking to become comprehensive infrastructure for corporate accountability:
- **Environmental commitments** and greenwashing detection
- **Labor practices** and supply chain transparency
- **Political contributions** and lobbying disclosure
- **Tax practices** and jurisdictional arbitrage
- **Executive compensation** tied to social metrics

We believe **accountability requires visibility, verification, and accessibility**. This is just the beginning.

---

## License

**MEASURE Labs** is licensed under a **Proprietary Source-Available License**.

### What This Means:

✅ **You CAN:**
- View and study the source code
- Use the software and API for personal, research, or commercial purposes
- Access and utilize the data through our platform and API
- Augment the codebase in its current or future form

❌ **You CANNOT:**
- Distribute the source code
- Create derivative works for distribution
- Fork the repository for public distribution
- Redistribute the data outside of our platform
- Host competing versions of MEASURE Labs
- Remove or modify attribution

⚠️ **You MUST:**
- Maintain proper attribution to MEASURE Labs
- Keep modifications private (not for distribution)
- Comply with API terms of service
- Cite MEASURE Labs when using our data in publications

### Why This License?

We chose a proprietary source-available model to ensure that:
1. **Quality and accuracy are maintained**: Centralized updates prevent fragmented, outdated versions
2. **Data integrity is protected**: A single source of truth for corporate accountability
3. **Sustainability is ensured**: Resources can be invested in continuous improvement
4. **Accountability remains transparent**: Code is viewable but the platform remains unified

### Data Access

MEASURE Labs data is accessible through:
- **Public Website**: Free browsing and search
- **Public API**: Rate-limited free tier for developers and researchers
- **Premium API**: Unlimited access for organizations and commercial use
- **Research Partnerships**: Custom data exports for qualified academic research

### Commercial Use & Partnerships

Organizations wishing to use MEASURE Labs for commercial applications should contact:  
**contribute@measurelabs.org**

We offer:
- Premium API access with higher rate limits
- Custom data feeds and integrations
- Bulk data licensing
- Strategic partnerships
- White-label solutions (case-by-case basis)

---

## Acknowledgments

### Data Sources

MEASURE Labs aggregates information from:
- Corporate websites and ESG reports
- SEC filings and proxy statements
- Reputable news organizations
- Legal databases (PACER, CourtListener)
- Advocacy organizations and think tanks
- Academic research

### Technology

Built with open-source tools:
- [Next.js](https://nextjs.org/) - React framework
- [FastAPI](https://fastapi.tiangolo.com/) - Python API framework
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - Component library

### Community

Thank you to our contributors, advisors, and early users who helped shape this platform.

Special thanks to the open-source community for building the tools that make this work possible.

---

## Contact & Support

- **Website**: [measurelabs.org](https://measurelabs.org)
- **Email**: contribute@measurelabs.org
- **GitHub**: [github.com/measurelabs](https://github.com/measurelabs)

---

## Disclaimer

MEASURE Labs provides information for educational and research purposes. While we strive for accuracy:

- Our data aggregates publicly available information
- AI summaries are generated from source materials but may contain errors
- We are not legal or financial advisors
- Users should verify information for critical decisions
- Company profiles reflect available data and may not be comprehensive

For corrections or concerns, contact: **contribute@measurelabs.org**

---

**Making Corporate Accountability Transparent and Accessible**

MEASURE Labs is an independent research platform committed to empowering individuals with the information they need to make values-aligned decisions. We believe institutions should be held accountable for their commitments—and that accountability starts with visibility.

🌟 **Star this repository** if you support transparent corporate accountability!

---

*Last Updated: November 2025*
