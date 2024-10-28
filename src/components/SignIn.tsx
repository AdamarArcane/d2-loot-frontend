'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Zap, Crosshair, ChevronDown, Sword, Target, Sparkles, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ModeToggle } from "./mode-toggle"

const backendURL = import.meta.env.VITE_BACKEND_URL;
const frontendURL = import.meta.env.FRONTEND_URL;
console.log(backendURL)

export default function LandingPage() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleSignIn = () => {
        window.location.href = backendURL + '/login'
    }

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <header className={cn(
                "sticky top-0 z-50 w-full border-b transition-shadow duration-300",
                scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md" : "bg-transparent"
            )}>
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2" aria-label="D2 Loot Home">
                                <ShieldCheck className="h-8 w-8 text-primary" aria-hidden="true" />
                                <span className="font-bold text-xl text-foreground">D2 Loot</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <ModeToggle />
                            <Button onClick={handleSignIn} size="sm" className="text-sm md:text-base md:px-4 ml-2">
                                Sign in
                            </Button>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="flex-grow">
                <section className="relative w-full py-24 md:py-32 lg:py-40 xl:py-48 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://www.bungie.net/img/destiny_content/pgcr/vespers_host.jpg"
                            alt="Destiny 2 Background"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/90 backdrop-blur-sm"></div>
                    </div>
                    <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-foreground drop-shadow-lg">
                                Prepare for Destiny 2 Endgame
                            </h1>
                            <p className="mt-6 max-w-md mx-auto text-xl text-primary sm:text-2xl md:mt-8 md:max-w-3xl font-semibold">
                                Optimize your arsenal and dominate challenging activities
                            </p>
                            <p className="mt-3 max-w-md mx-auto text-lg text-foreground/90 sm:text-xl md:mt-5 md:max-w-3xl">
                                Get personalized weapon recommendations and activity suggestions to enhance your loadout
                            </p>
                            <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:gap-5">
                                    <Button onClick={handleSignIn} size="lg" className="w-full text-lg hover:scale-105 transition-transform duration-300">
                                        Get Started
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                        <ChevronDown className="h-12 w-12 text-foreground animate-bounce" />
                    </div>
                </section>

                <section id="features" className="py-24 bg-accent/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                Elevate Your Destiny 2 Experience
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground">
                                Discover how D2 Loot can prepare you for the most challenging endgame content.
                            </p>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <FeatureCard
                                icon={<ShieldCheck className="h-10 w-10 text-blue-500" />}
                                title="Inventory Rating"
                                description="Get comprehensive insights on your weapon collection. Understand your strengths and areas for improvement."
                            />
                            <FeatureCard
                                icon={<Zap className="h-10 w-10 text-amber-500" />}
                                title="Top Recommendations"
                                description="Discover the best weapons to pursue based on your playstyle and current inventory. Stay ahead of the meta."
                            />
                            <FeatureCard
                                icon={<Crosshair className="h-10 w-10 text-emerald-500" />}
                                title="Activity Suggestions"
                                description="Receive personalized activity recommendations to efficiently acquire the loot you need for endgame success."
                            />
                        </div>
                    </div>
                </section>

                <section id="endgame-prep" className="py-24 bg-background">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl text-center mb-12">
                            Prepare for Endgame Challenges
                        </h2>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <EndgameCard
                                name="Raids"
                                icon={<Sword className="h-8 w-8 text-yellow-500" />}
                                description="Get equipped for the most challenging 6-player cooperative activities."
                            />
                            <EndgameCard
                                name="Grandmaster Nightfalls"
                                icon={<Target className="h-8 w-8 text-red-500" />}
                                description="Optimize your loadout for the toughest 3-player strike missions."
                            />
                            <EndgameCard
                                name="Dungeons"
                                icon={<Sparkles className="h-8 w-8 text-purple-500" />}
                                description="Gear up for challenging 3-player mini-raids with unique mechanics and rewards."
                            />
                        </div>
                    </div>
                </section>

                <section id="cta" className="relative py-24 overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://www.bungie.net/img/destiny_content/pgcr/vespers_host.jpg"
                            alt="Destiny 2 Background"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-background/90 backdrop-blur-sm"></div>
                    </div>
                    <div className="max-w-4xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8 relative z-10">
                        <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl lg:text-5xl">
                            <span className="block">Ready to conquer Destiny 2's endgame?</span>
                        </h2>
                        <p className="mt-4 text-xl leading-6 text-muted-foreground">
                            Join thousands of Guardians who have optimized their loadouts and conquered the toughest challenges.
                        </p>
                        <Button onClick={handleSignIn} size="lg" className="mt-8 w-full sm:w-auto text-lg hover:scale-105 transition-transform duration-300" variant="default">
                            Sign in with Bungie
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="bg-background">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <a href={frontendURL} className="text-muted-foreground hover:text-foreground transition-colors duration-300">
                            d2loot.com
                        </a>
                    </div>
                    <div className="mt-8 md:mt-0 md:order-1">
                        <p className="text-center text-base text-muted-foreground">
                            &copy; 2024 D2 Loot. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <Card className="flex flex-col items-center text-center p-6 bg-card hover:bg-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div className="rounded-full bg-primary/10 p-3 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <CardContent className="text-muted-foreground">{description}</CardContent>
        </Card>
    )
}

function EndgameCard({ name, icon, description }: { name: string; icon: React.ReactNode; description: string }) {
    return (
        <Card className="flex flex-col p-6 bg-card hover:bg-accent/50 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            <div className="flex items-center space-x-2 mb-4">
                {icon}
                <h3 className="text-lg font-semibold">{name}</h3>
            </div>
            <CardContent className="flex-grow">
                <p className="text-sm">{description}</p>
            </CardContent>
        </Card>
    )
}