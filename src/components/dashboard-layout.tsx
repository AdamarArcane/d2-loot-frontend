import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShieldCheck, Sun, Moon, LogOut, Menu } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link, useNavigate } from 'react-router-dom'
import { ModeToggle } from "./mode-toggle"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)
    const { setTheme, theme } = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        setMounted(true)
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!mounted) return null

    const handleSignOut = async () => {
        try {
            const response = await fetch('https://gannet-sweeping-frequently.ngrok-free.app/api/logout', {
                method: 'POST',
                credentials: 'include',
            })

            if (response.ok) {
                toast({
                    title: "Logged out successfully",
                    description: "You have been logged out of your account.",
                })
                // After signing out, redirect to the homepage
                navigate('/')
            } else {
                throw new Error('Logout failed')
            }
        } catch (error) {
            console.error('Error signing out:', error)
            toast({
                title: "Logout failed",
                description: "There was a problem logging out. Please try again.",
                variant: "destructive",
            })
        }
    }

    const LogoutButton = ({ className }: { className?: string }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className={className}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Sign out</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You will be signed out of your account and redirected to the homepage.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut}>Log out</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <header className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md" : "bg-background"
                }`}>
                <div className="container mx-auto px-4">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <Link to="/" className="flex items-center space-x-2">
                                <ShieldCheck className="h-8 w-8 text-primary" />
                                <span className="font-bold text-xl">D2 Loot</span>
                            </Link>
                        </div>
                        <div className="hidden md:flex items-center space-x-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    {/*<Button variant="ghost" size="icon">
                                        <Bell className="h-5 w-5" />
                                        <span className="sr-only">Notifications</span>
                                    </Button>*/}
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64">
                                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>New weapon recommendation available</DropdownMenuItem>
                                    <DropdownMenuItem>Your inventory rating has improved</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ModeToggle />
                            <LogoutButton />
                        </div>
                        <button
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className="sr-only">Open main menu</span>
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <ScrollArea className="fixed inset-0 top-16 z-50 h-[calc(100vh-4rem)] w-full overflow-y-auto bg-background pb-6 md:hidden">
                    <div className="container mx-auto px-4 py-6 space-y-4">
                        <Button variant="ghost" className="w-full justify-start" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                            {theme === 'dark' ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                            Toggle theme
                        </Button>
                        <LogoutButton className="w-full justify-start" />
                    </div>
                </ScrollArea>
            )}

            <main className="flex-grow">
                {children}
            </main>

            <footer className="bg-background border-t">
                <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <span className="font-semibold">D2 Loot</span>
                    </div>
                    <nav className="flex space-x-4 mt-4 sm:mt-0">

                        <a href="https://d2loot.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            d2loot.com
                        </a>
                    </nav>
                </div>
            </footer>
        </div>
    )
}