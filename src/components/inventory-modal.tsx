import { useState, useMemo } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search, Filter, SortAsc, X } from "lucide-react"
import { FixedSizeList as List } from 'react-window'
import AutoSizer from 'react-virtualized-auto-sizer'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface WeaponDetail {
    id: string;
    weaponName: string;
    icon: string;
    weaponType: string;
    source: string;
    points: number;
    obtained: boolean;
}

interface InventoryModalProps {
    weapons: WeaponDetail[];
    weaponTypes: string[];
    children: React.ReactNode;
}

const WeaponItem = ({ index, style, data }: { index: number; style: React.CSSProperties; data: WeaponDetail[] }) => {
    const weapon = data[index];
    return (
        <div style={style} className="flex items-center p-2 border-b">
            <img src={weapon.icon} alt={weapon.weaponName} className="w-8 h-8 mr-2 object-contain rounded-sm border border-border" />
            <div className="flex-grow">
                <div className="font-medium">{weapon.weaponName}</div>
                <div className="text-sm text-muted-foreground">{weapon.weaponType}</div>
            </div>
            <Badge variant={weapon.obtained ? "default" : "secondary"}>
                {weapon.obtained ? "Obtained" : `${weapon.points.toFixed(1)} pts`}
            </Badge>
        </div>
    );
};

export default function InventoryModal({ weapons, weaponTypes, children }: InventoryModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterObtained, setFilterObtained] = useState('all');
    const [sortBy, setSortBy] = useState('name');

    const filteredWeapons = useMemo(() => {
        return weapons
            .filter(weapon =>
                weapon.weaponName.toLowerCase().includes(search.toLowerCase()) &&
                (filterType === 'all' || weapon.weaponType === filterType) &&
                (filterObtained === 'all' ||
                    (filterObtained === 'obtained' && weapon.obtained) ||
                    (filterObtained === 'notObtained' && !weapon.obtained))
            )
            .sort((a, b) => {
                if (sortBy === 'name') return a.weaponName.localeCompare(b.weaponName);
                if (sortBy === 'type') return a.weaponType.localeCompare(b.weaponType);
                if (sortBy === 'points') return b.points - a.points;
                return 0;
            });
    }, [weapons, search, filterType, filterObtained, sortBy]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Weapon Inventory</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search weapons..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8 pr-8"
                        />
                        {search && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-1/2 transform -translate-y-1/2"
                                onClick={() => setSearch('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterType('all')}>
                                All Types
                                {filterType === 'all' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                            {weaponTypes.map(type => (
                                <DropdownMenuItem key={type} onClick={() => setFilterType(type)}>
                                    {type}
                                    {filterType === type && <span className="ml-auto">✓</span>}
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setFilterObtained('all')}>
                                All Weapons
                                {filterObtained === 'all' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterObtained('obtained')}>
                                Obtained
                                {filterObtained === 'obtained' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setFilterObtained('notObtained')}>
                                Not Obtained
                                {filterObtained === 'notObtained' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SortAsc className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setSortBy('points')}>
                                Points
                                {sortBy === 'points' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('name')}>
                                Name
                                {sortBy === 'name' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('type')}>
                                Type
                                {sortBy === 'type' && <span className="ml-auto">✓</span>}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex-grow">
                    <AutoSizer>
                        {({ height, width }) => (
                            <List
                                height={height}
                                itemCount={filteredWeapons.length}
                                itemSize={50}
                                width={width}
                                itemData={filteredWeapons}
                            >
                                {WeaponItem}
                            </List>
                        )}
                    </AutoSizer>
                </div>
            </DialogContent>
        </Dialog>
    );
}