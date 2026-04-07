import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchInput({
  value,
  onChange,
  placeholder = '',
}: SearchInputProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2"
        style={{ color: 'var(--palette-muted-fg)' }}
      />
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
      />
    </div>
  )
}
