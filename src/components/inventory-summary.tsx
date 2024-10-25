import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BarChart3 } from "lucide-react"

interface WeaponDetail {
    id: string;
    weaponName: string;
    icon: string;
    weaponType: string;
    source: string;
    points: number;
    perks: { name: string; obtained: boolean; description: string; }[] | null;
    recommendedPerks: string[] | null;
    obtained: boolean;
    description: string;
}

interface ResponseData {
    username: string;
    inventoryRating: {
        totalPoints: number;
        maxPossiblePoints: number;
        weeklyChange: number;
    };
    nextImportantGun: {
        name: string;
        icon: string;
        weaponType: string;
        description: string;
        source: string;
        points: number;
    };
    weaponDetails: WeaponDetail[];
}

interface InventorySummaryProps {
    weaponTypes: string[];
    calculateProgress: (type: string) => number;
    data: ResponseData;
}

export default function InventorySummary({ weaponTypes, calculateProgress, data }: InventorySummaryProps) {
    const [selectedType, setSelectedType] = useState(weaponTypes[0]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Inventory
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Inventory Summary</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">{selectedType}</h3>
                                <span className="text-sm font-medium">
                                    {data.weaponDetails.filter(w => w.weaponType === selectedType && w.obtained).length} / {data.weaponDetails.filter(w => w.weaponType === selectedType).length}
                                </span>
                            </div>
                            <Progress value={calculateProgress(selectedType)} className="h-2 w-full" />
                        </CardContent>
                    </Card>
                    <div className="grid grid-cols-3 gap-2">
                        {weaponTypes.map(type => (
                            <Button
                                key={type}
                                variant={type === selectedType ? "default" : "outline"}
                                className="w-full h-auto py-2 px-3 text-xs"
                                onClick={() => setSelectedType(type)}
                            >
                                <div className="w-full text-left">
                                    <div className="font-medium truncate">{type}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {calculateProgress(type).toFixed(0)}%
                                    </div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}