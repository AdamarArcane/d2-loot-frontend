"use client"

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SearchIcon, XIcon, Info, Filter, SortAsc } from "lucide-react"
import InventoryRatingCard from './inventory-rating-card'
import ActivityRecommendation from './activity-recommendation'
import { PlayerInfoBar } from './player-info-bar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Perk {
    name: string;
    obtained: boolean;
    description: string;
}

interface WeaponDetail {
    id: string;
    weaponName: string;
    icon: string;
    weaponType: string;
    source: string;
    points: number;
    perks: Perk[] | null;
    recommendedPerks: string[] | null;
    obtained: boolean;
    description: string;
}

interface NextImportantGun {
    name: string;
    icon: string;
    weaponType: string;
    description: string;
    source: string;
    points: number;
}

interface InventoryRating {
    totalPoints: number;
    maxPossiblePoints: number;
    weeklyChange: number;
}

interface ResponseData {
    username: string;
    inventoryRating: InventoryRating;
    nextImportantGun: NextImportantGun;
    weaponDetails: WeaponDetail[];
}

const WeaponCard = ({ weapon }: { weapon: WeaponDetail }) => {
    const recommendedPerks = weapon.recommendedPerks || [];

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const getMobileWeaponType = (weaponType: string) => {
        const mobileTypes: { [key: string]: string } = {
            "Grenade Launcher": "GL",
            "Combat Bow": "Bow",
            "Fusion Rifle": "Fusion",
            "Sniper Rifle": "Sniper",
            "Machine Gun": "LMG",
            "Trace Rifle": "Trace",
            "Pulse Rifle": "Pulse",
            "Submachine Gun": "SMG",
            "Rocket Launcher": "Rocket",
            "Linear Fusion Rifle": "LFR",
            "Auto Rifle": "AR",
            "Hand Cannon": "HC"
        };
        return mobileTypes[weaponType] || weaponType;
    };

    return (
        <Card>
            <CardHeader className="pb-2 relative">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-bold">{weapon.weaponName}</CardTitle>
                    <Badge variant={weapon.points > 80 ? "destructive" : weapon.points > 50 ? "default" : "secondary"}>
                        {weapon.points.toFixed(1)} pts
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="relative">
                <div className="flex items-start space-x-4 mb-4">
                    <img
                        src={weapon.icon}
                        alt={weapon.weaponName}
                        className="w-16 h-16 object-contain rounded-md border border-border"
                    />
                    <div className="flex-grow">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Badge variant="outline" className="text-xs">
                                            <span className="sm:hidden">{getMobileWeaponType(weapon.weaponType)}</span>
                                            <span className="hidden sm:inline">{weapon.weaponType}</span>
                                        </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{weapon.weaponType}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <span className="text-xs text-muted-foreground">|</span>
                            <span className="text-xs text-muted-foreground truncate">{weapon.source}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{weapon.description}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <Info className="w-4 h-4 text-primary" />
                        <h4 className="text-sm font-semibold">Recommended Perks</h4>
                    </div>
                    {recommendedPerks.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                            {recommendedPerks.map((perk, index) => (
                                <TooltipProvider key={index}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs px-2 py-0.5 truncate max-w-[120px]"
                                            >
                                                {truncateText(perk, 15)}
                                            </Badge>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{perk}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recommended perks available</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function Dashboard() {
    const [data, setData] = useState<ResponseData | null>(null);
    const [sortBy, setSortBy] = useState<'points' | 'name' | 'type'>('points');
    const [filterType, setFilterType] = useState<string>('all');
    const [visibleWeapons, setVisibleWeapons] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch('https://api.d2loot.com/user-data', {
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Unauthorized');
            }
            const newData: ResponseData = await response.json();
            setData(newData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            window.location.href = '/';
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDataRefresh = useCallback(async () => {
        await fetchData();
    }, [fetchData]);

    const loadMoreWeapons = () => {
        setIsLoading(true);
        setTimeout(() => {
            setVisibleWeapons(prevVisible => prevVisible + 12);
            setIsLoading(false);
        }, 500);
    };

    if (!data) {
        return (
            <div className="container mx-auto p-4 space-y-6">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    const filteredAndSortedWeapons = data.weaponDetails
        .filter(weapon => !weapon.obtained)
        .filter(weapon => filterType === 'all' || weapon.weaponType === filterType)
        .filter(weapon =>
            weapon.weaponName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            weapon.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            weapon.source.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === 'points') return b.points - a.points;
            if (sortBy === 'name') return a.weaponName.localeCompare(b.weaponName);
            if (sortBy === 'type') return a.weaponType.localeCompare(b.weaponType);
            return 0;
        });

    const visibleWeaponsList = filteredAndSortedWeapons.slice(0, visibleWeapons);
    const hasMoreWeapons = visibleWeapons < filteredAndSortedWeapons.length;

    const weaponTypes = Array.from(new Set(data.weaponDetails.map(weapon => weapon.weaponType)))

    return (
        <div className="container mx-auto p-4 space-y-6">
            <PlayerInfoBar
                username={data.username}
                recommendedWeaponsCount={filteredAndSortedWeapons.length}
                onDataRefresh={handleDataRefresh}
            />
            <div className="grid gap-4 md:grid-cols-2">
                <ActivityRecommendation weapons={data.weaponDetails} />
                <InventoryRatingCard
                    totalPoints={data.inventoryRating.totalPoints}
                    maxPossiblePoints={data.inventoryRating.maxPossiblePoints}
                    weeklyChange={data.inventoryRating.weeklyChange}
                    weapons={data.weaponDetails}
                    weaponTypes={weaponTypes}
                />
            </div>
            <section>
                <div className="flex flex-col space-y-4 mb-4">
                    <h2 className="text-2xl font-bold">Weapon Recommendations</h2>
                    <div className="flex items-center space-x-2">
                        <div className="relative flex-grow">
                            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search weapons..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 pr-4"
                            />
                            {searchQuery && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                                    onClick={() => setSearchQuery('')}
                                >
                                    <XIcon className="h-4 w-4" />
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
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visibleWeaponsList.map((weapon) => (
                        <WeaponCard
                            key={weapon.id}
                            weapon={weapon}
                        />
                    ))}
                </div>
                {hasMoreWeapons && (
                    <div className="mt-8 flex justify-center mb-4">
                        <Button onClick={loadMoreWeapons} disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                )}
            </section>
        </div>
    )
}