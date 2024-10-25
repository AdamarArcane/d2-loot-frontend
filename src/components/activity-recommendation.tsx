import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Activity, Target, Swords, MapPin, HelpCircle, Zap, ChevronDown } from "lucide-react"
import { activityDetails } from './activity-details'
import { cn } from "@/lib/utils"

interface WeaponDetail {
    id: string;
    weaponName: string;
    icon: string;
    weaponType: string;
    source: string;
    points: number;
    obtained: boolean;
    recommendedPerks: string[] | null;
}

interface ActivityRecommendationProps {
    weapons: WeaponDetail[];
}

interface ActivitySummary {
    source: string;
    totalPoints: number;
    weapons: WeaponDetail[];
    activityType: string;
    image: string;
}

const excludedSources = ["world drop", "exotic archive", "exotic engram"];

const getActivityDetails = (source: string): { activityType: string; image: string } => {
    return activityDetails[source] || activityDetails["Unknown Activity"];
};

function WeaponCard({ weapon }: { weapon: WeaponDetail }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className={cn(
                "bg-secondary/50 rounded-md overflow-hidden transition-all duration-200",
                isExpanded ? "bg-secondary/70" : "hover:bg-secondary/70",
                isExpanded ? "" : "h-[72px]" // Fixed height when not expanded
            )}
        >
            <div
                className="flex items-center space-x-2 p-3 cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <img src={weapon.icon}
                    alt={weapon.weaponName}
                    className="w-10 h-10 object-contain rounded-sm border border-border" />
                <div className="flex-grow">
                    <div className="font-medium">{weapon.weaponName}</div>
                    <div className="text-sm text-muted-foreground">{weapon.weaponType}</div>
                </div>
                <Badge variant="secondary">{weapon.points.toFixed(1)} pts</Badge>
                <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isExpanded && "transform rotate-180"
                )} />
            </div>
            {isExpanded && (
                <div className="p-3 bg-secondary/30">
                    <h5 className="text-sm font-semibold mb-2">Recommended Perks:</h5>
                    {weapon.recommendedPerks && weapon.recommendedPerks.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {weapon.recommendedPerks.map((perk, index) => (
                                <Badge key={index} variant="outline" className="bg-primary/10">
                                    {perk}
                                </Badge>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No recommended perks available</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ActivityRecommendation({ weapons }: ActivityRecommendationProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const activities = weapons.reduce((acc: Record<string, ActivitySummary>, weapon) => {
        if (!weapon.obtained && !excludedSources.includes(weapon.source.toLowerCase())) {
            if (!acc[weapon.source]) {
                const { activityType, image } = getActivityDetails(weapon.source);
                acc[weapon.source] = {
                    source: weapon.source,
                    totalPoints: 0,
                    weapons: [],
                    activityType,
                    image
                };
            }
            acc[weapon.source].totalPoints += weapon.points;
            acc[weapon.source].weapons.push(weapon);
        }
        return acc;
    }, {});

    const sortedActivities = Object.values(activities).sort((a, b) => b.totalPoints - a.totalPoints);

    if (sortedActivities.length === 0) {
        return <Card className="w-full"><CardContent>No activities available.</CardContent></Card>;
    }

    const topActivity = sortedActivities[0];

    return (
        <Card className="w-full overflow-hidden flex flex-col">
            <div
                className="w-full h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${topActivity.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
                <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-white flex items-center">
                            <Activity className="w-6 h-6 mr-2 text-yellow-500" />
                            Top Activity Recommendation
                        </CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">What is this?</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>About Activity Recommendations</DialogTitle>
                                </DialogHeader>
                                <p>
                                    Activity Recommendations suggest the best activities to participate in to improve your
                                    weapon inventory. The top recommendation is based on the potential points you can earn
                                    from weapons available in that activity.
                                </p>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
            </div>
            <CardContent className="pt-6 flex-grow flex flex-col">
                <div className="space-y-4 flex-grow">
                    <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-semibold">{topActivity.source}</h3>
                        <Badge variant="secondary" className="text-sm">
                            {topActivity.totalPoints.toFixed(1)} potential pts
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                            <Swords className="w-4 h-4 mr-1" />
                            <span>{topActivity.activityType}</span>
                        </div>
                        <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            <span>{topActivity.weapons.length} weapons to acquire</span>
                        </div>
                    </div>
                    <p className="text-sm">
                        Complete this activity to earn the most points for your inventory.
                        You can acquire powerful weapons such as {topActivity.weapons.slice(0, 3).map(w => w.weaponName).join(', ')}, and more.
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">
                            <Zap className="w-4 h-4 mr-2" />
                            View All Activities
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
                        <DialogHeader>
                            <DialogTitle>Available Weapons by Activity</DialogTitle>
                        </DialogHeader>
                        <ScrollArea className="flex-grow">
                            <div className="pr-4">
                                {sortedActivities.map((activity) => (
                                    <div key={activity.source} className="mb-6 last:mb-0">
                                        <div className="sticky top-0 bg-background z-10 py-2">
                                            <h4 className="text-lg font-semibold flex items-center justify-between">
                                                <span className="flex items-center">
                                                    <MapPin className="w-4 h-4 mr-2" />
                                                    {activity.source}
                                                </span>
                                                <Badge variant="outline">
                                                    {activity.totalPoints.toFixed(1)} pts
                                                </Badge>
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                                            {activity.weapons.map((weapon) => (
                                                <WeaponCard key={weapon.id} weapon={weapon} />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    );
}