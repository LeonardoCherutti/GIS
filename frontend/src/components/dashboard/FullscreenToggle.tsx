'use client'

import { useEffect, useState } from 'react'
import { Maximize, Minimize } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FullscreenToggleProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function FullscreenToggle({ containerRef }: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [supported, setSupported] = useState(false)

  useEffect(() => {
    setSupported(document.fullscreenEnabled)

    function handleChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleChange)
    return () => document.removeEventListener('fullscreenchange', handleChange)
  }, [])

  if (!supported) return null

  function toggle() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      containerRef.current?.requestFullscreen()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 z-20"
      onClick={toggle}
      aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
    >
      {isFullscreen ? <Minimize className="size-4" /> : <Maximize className="size-4" />}
    </Button>
  )
}
