import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';

export function PropertyFiltersComponent({
  filters,
  onFiltersChange,
  onClear,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters = Boolean(
    filters.city ||
      filters.property_type ||
      filters.minPrice ||
      filters.maxPrice
  );

  return (
    <div className="bg-card rounded-xl border border-border p-4 md:p-6 space-y-4">
      
      {/* Main Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="city" className="sr-only">
            Location
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="city"
              placeholder="Search by city or area..."
              value={filters.city || ''}
              onChange={(e) =>
                onFiltersChange({ ...filters, city: e.target.value })
              }
              className="pl-10 input-search"
            />
          </div>
        </div>

        <div className="w-full md:w-48">
          <Label htmlFor="type" className="sr-only">
            Property Type
          </Label>
          <Select
            value={filters.property_type || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                property_type: value === 'all' ? undefined : value,
              })
            }
          >
            <SelectTrigger id="type" className="input-search">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="room">Room</SelectItem>
              <SelectItem value="pg">PG</SelectItem>
              <SelectItem value="hostel">Hostel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button variant="ghost" size="icon" onClick={onClear}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-4 border-t border-border space-y-4 animate-fade-in">
          <div>
            <Label className="text-sm font-medium">
              Price Range: ₹{filters.minPrice || 0} - ₹
              {filters.maxPrice || 50000}
            </Label>
            <div className="pt-4 px-2">
              <Slider
                value={[
                  filters.minPrice || 0,
                  filters.maxPrice || 50000,
                ]}
                min={0}
                max={50000}
                step={1000}
                onValueChange={([min, max]) =>
                  onFiltersChange({
                    ...filters,
                    minPrice: min,
                    maxPrice: max,
                  })
                }
                className="w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={filters.is_available === true}
              onChange={(e) =>
                onFiltersChange({
                  ...filters,
                  is_available: e.target.checked ? true : undefined,
                })
              }
              className="rounded border-border"
            />
            <Label htmlFor="available" className="text-sm cursor-pointer">
              Show only available properties
            </Label>
          </div>
        </div>
      )}
    </div>
  );
}
