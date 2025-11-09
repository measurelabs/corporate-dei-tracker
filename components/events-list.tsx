'use client'

import { Event } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface EventsListProps {
  events: Event[]
  showCompany?: boolean
}

export function EventsList({ events, showCompany = false }: EventsListProps) {
  if (!events || events.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No events found
        </CardContent>
      </Card>
    )
  }

  const getSentimentBadge = (sentiment?: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <Badge variant="default" className="bg-green-500">Positive</Badge>
      case 'negative':
        return <Badge variant="destructive">Negative</Badge>
      case 'neutral':
        return <Badge variant="secondary">Neutral</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getImpactIcon = (direction?: string | null) => {
    switch (direction?.toLowerCase()) {
      case 'positive':
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative':
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getImpactBadge = (impact?: string | null) => {
    switch (impact?.toLowerCase()) {
      case 'high':
      case 'major':
      case 'significant':
        return <Badge variant="destructive">High Impact</Badge>
      case 'medium':
      case 'moderate':
        return <Badge variant="default">Medium Impact</Badge>
      case 'low':
      case 'minor':
        return <Badge variant="secondary">Low Impact</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg">
                  {event.headline || event.event_type}
                </CardTitle>
                {showCompany && event.company && (
                  <p className="text-sm text-muted-foreground">
                    {event.company.name} ({event.company.ticker})
                  </p>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getSentimentBadge(event.sentiment)}
                {getImpactBadge(event.impact)}
                {event.impact_direction && (
                  <div className="flex items-center gap-1">
                    {getImpactIcon(event.impact_direction)}
                    {event.impact_magnitude && (
                      <span className="text-xs text-muted-foreground">
                        {event.impact_magnitude}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          {event.summary && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{event.summary}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline">{event.event_type}</Badge>
                {event.event_category && (
                  <Badge variant="outline">{event.event_category}</Badge>
                )}
              </div>
              {event.quotes && event.quotes.length > 0 && (
                <div className="mt-4 border-l-2 border-muted pl-4">
                  <p className="text-sm italic text-muted-foreground">
                    &quot;{typeof event.quotes[0] === 'string' ? event.quotes[0] : (event.quotes[0] as any)?.text || JSON.stringify(event.quotes[0])}&quot;
                  </p>
                </div>
              )}
              {event.sources && event.sources.length > 0 && (
                <div className="mt-4 pt-3 border-t">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">SOURCES</p>
                  <div className="space-y-1">
                    {event.sources.map((source: any, idx: number) => (
                      <div key={idx} className="text-xs">
                        {source.url ? (
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {source.title || source.url?.replace(/^https?:\/\/(www\.)?/, '').split('/')[0] || source.source_type?.replace(/_/g, ' ') || 'Source'}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">
                            {source.title || source.source_type?.replace(/_/g, ' ') || 'Source'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
