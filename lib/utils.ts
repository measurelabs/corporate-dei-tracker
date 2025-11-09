import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getRiskLevelColor(level: string | null | undefined): string {
  if (!level) return 'gray'
  switch (level.toLowerCase()) {
    case 'low':
      return 'green'
    case 'medium':
      return 'yellow'
    case 'high':
      return 'orange'
    case 'critical':
      return 'red'
    default:
      return 'gray'
  }
}

export function getStatusBadgeColor(status: string | null | undefined): string {
  if (!status) return 'gray'
  switch (status.toLowerCase()) {
    case 'active':
    case 'committed':
    case 'strong':
      return 'green'
    case 'discontinued':
    case 'eliminated':
      return 'red'
    case 'under_review':
    case 'monitor':
    case 'watch':
      return 'yellow'
    case 'scaling_back':
    case 'retreat':
      return 'orange'
    case 'modified':
    case 'moderate':
      return 'blue'
    default:
      return 'gray'
  }
}

export function getRecommendationColor(recommendation: string | null | undefined): string {
  if (!recommendation) return 'gray'
  const rec = recommendation.toLowerCase()

  // Red: Avoid/Caution (most negative)
  if (rec.includes('avoid') || rec.includes('caution') || rec.includes('sell')) {
    return 'red'
  }
  // Orange: Reduce/Divest (high concern)
  if (rec.includes('reduce') || rec.includes('divest')) {
    return 'orange'
  }
  // Yellow: Monitor/Watch (medium concern)
  if (rec.includes('monitor') || rec.includes('watch') || rec.includes('hold')) {
    return 'yellow'
  }
  // Green: Buy/Invest/Strong (positive)
  if (rec.includes('strong') || rec.includes('buy') || rec.includes('invest') || rec.includes('increase')) {
    return 'green'
  }
  // Blue: Neutral/Maintain
  return 'blue'
}

export function getDEIStatusColor(status: string | null | undefined): string {
  if (!status) return 'gray'
  const deiStatus = status.toLowerCase()

  // Red: Eliminated (most negative)
  if (deiStatus.includes('eliminated')) {
    return 'red'
  }
  // Orange: Scaling back/Retreat (high concern)
  if (deiStatus.includes('scaling_back') || deiStatus.includes('retreat')) {
    return 'orange'
  }
  // Yellow: Under review/Minimal (medium concern)
  if (deiStatus.includes('under_review') || deiStatus.includes('minimal')) {
    return 'yellow'
  }
  // Green: Committed/Active/Strong (positive)
  if (deiStatus.includes('committed') || deiStatus.includes('active') || deiStatus.includes('strong')) {
    return 'green'
  }
  // Blue: Moderate (neutral)
  if (deiStatus.includes('moderate')) {
    return 'blue'
  }
  // Gray: Unknown
  return 'gray'
}

export function getRatingColor(rating: number | null | undefined): string {
  if (!rating) return 'gray'

  // Heatmap based on numeric rating (0-10 scale)
  if (rating >= 8) return 'green'    // 8-10: Excellent
  if (rating >= 6) return 'blue'     // 6-7: Good
  if (rating >= 4) return 'yellow'   // 4-5: Fair
  if (rating >= 2) return 'orange'   // 2-3: Poor
  return 'red'                       // 0-1: Very Poor
}

export function formatIndustry(industry: string | null | undefined): string {
  if (!industry) return '—'

  // Split on ' - ' to get first part if it exists
  const mainIndustry = industry.split(' - ')[0]

  // Replace underscores with spaces and convert to title case
  return mainIndustry
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
