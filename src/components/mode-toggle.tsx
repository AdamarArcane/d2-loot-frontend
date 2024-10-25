import { useState, useEffect } from 'react'
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
        >
            <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
                }`} />
            <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ease-in-out ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                }`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}