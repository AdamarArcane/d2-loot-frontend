import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PlayerInfoBarProps {
    username: string;
    recommendedWeaponsCount: number;
    className?: string;
}

export function PlayerInfoBar({ username, recommendedWeaponsCount, className }: PlayerInfoBarProps) {
    const [lastUpdated] = useState<Date>(new Date())

    const formatLastUpdated = (date: Date): string => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'Just now'
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
        return `${Math.floor(diffInSeconds / 86400)} days ago`
    }

    return (
        <Card className={`bg-secondary/10 ${className}`}>
            <CardContent className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt={username} />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg">{username}</h3>
                        <span className="text-sm text-muted-foreground">
                            Last updated: {formatLastUpdated(lastUpdated)}
                        </span>
                    </div>
                </div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge variant="secondary" className="text-sm py-1 px-2">
                                <Target className="h-4 w-4 mr-1" />
                                <span className="hidden sm:inline">{recommendedWeaponsCount} recommended weapons</span>
                                <span className="sm:hidden">{recommendedWeaponsCount}</span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{recommendedWeaponsCount} recommended weapons</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardContent>
        </Card>
    )
}