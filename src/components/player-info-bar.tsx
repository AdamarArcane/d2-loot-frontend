'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, RefreshCw } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface PlayerInfoBarProps {
    username: string;
    recommendedWeaponsCount: number;
    className?: string;
    onDataRefresh: () => Promise<void>;
}

export function PlayerInfoBar({ username, recommendedWeaponsCount, className, onDataRefresh }: PlayerInfoBarProps) {
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { toast } = useToast()

    const refreshData = async () => {
        setIsRefreshing(true)
        try {
            await onDataRefresh()
            setLastUpdated(new Date())
            toast({
                title: "Data refreshed",
                description: "Your player data has been updated.",
            })
        } catch (error) {
            console.error('Error refreshing data:', error)
            toast({
                title: "Refresh failed",
                description: "There was a problem updating your data. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsRefreshing(false)
        }
    }

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
            <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" alt={username} />
                        <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-lg">{username}</h3>
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-muted-foreground">
                                Last updated: {formatLastUpdated(lastUpdated)}
                            </span>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={refreshData}
                                            disabled={isRefreshing}
                                        >
                                            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                                            <span className="sr-only">Refresh data</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Refresh data</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-sm py-1 px-2">
                        <Target className="h-4 w-4 mr-1" />
                        {recommendedWeaponsCount} recommended weapons
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}