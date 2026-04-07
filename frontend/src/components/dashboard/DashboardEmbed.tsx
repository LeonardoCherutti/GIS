'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { DashboardErrorBoundary } from './DashboardErrorBoundary'
import { FullscreenToggle } from './FullscreenToggle'

interface DashboardEmbedProps {
  url: string
  title: string
}

export function DashboardEmbed({ url, title }: DashboardEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const startTimeout = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setError(true)
      setLoading(false)
    }, 30_000)
  }, [])

  useEffect(() => {
    startTimeout()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [iframeKey, startTimeout])

  function handleLoad() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setLoading(false)
    setError(false)
  }

  function handleRetry() {
    setIframeKey((k) => k + 1)
    setLoading(true)
    setError(false)
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: 'calc(100vh - 8rem)' }}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center">
            <span
              className="inline-block w-8 h-8 border-3 rounded-full animate-spin mb-4"
              style={{
                borderColor: 'var(--palette-border)',
                borderTopColor: 'var(--palette-primary)',
              }}
            />
            <p style={{ color: 'var(--palette-muted-fg)' }}>Carregando dashboard...</p>
          </div>
        </div>
      )}
      {error ? (
        <DashboardErrorBoundary onRetry={handleRetry} />
      ) : (
        <iframe
          key={iframeKey}
          src={url}
          title={title}
          className="w-full h-full border-none z-0"
          allowFullScreen
          onLoad={handleLoad}
        />
      )}
      <FullscreenToggle containerRef={containerRef} />
    </div>
  )
}
