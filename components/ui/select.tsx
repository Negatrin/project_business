import { cn } from '@/lib/utils'
import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'block w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 pe-8 text-sm text-gray-900 shadow-sm focus:border-[#1dbf73] focus:outline-none focus:ring-1 focus:ring-[#1dbf73]',
              error && 'border-red-500',
              className,
            )}
            {...props}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute inset-y-0 end-2.5 my-auto h-4 w-4 text-gray-400" />
        </div>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
export { Select }
