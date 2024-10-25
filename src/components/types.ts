// Weapon related types
export interface Perk {
    name: string;
    obtained: boolean;
    description: string;
}

export interface WeaponDetail {
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

// Activity related types
export interface NextImportantGun {
    name: string;
    icon: string;
    weaponType: string;
    description: string;
    source: string;
    points: number;
}

export interface ActivitySummary {
    source: string;
    totalPoints: number;
    weapons: WeaponDetail[];
    activityType: string;
    image: string;
}

// Inventory related types
export interface InventoryRating {
    totalPoints: number;
    maxPossiblePoints: number;
    weeklyChange: number;
}

// API response type
export interface ResponseData {
    username: string;
    inventoryRating: InventoryRating;
    nextImportantGun: NextImportantGun;
    weaponDetails: WeaponDetail[];
}

// Component prop types
export interface InventoryRatingProps {
    totalPoints: number;
    maxPossiblePoints: number;
    weeklyChange: number;
    weapons: WeaponDetail[];
    weaponTypes: string[];
}

export interface ActivityRecommendationProps {
    weapons: WeaponDetail[];
}

export interface WeaponCardProps {
    weapon: WeaponDetail;
    onAddToWishlist: (id: string) => void;
}

// Activity details type
export type ActivityDetails = Record<string, { activityType: string; image: string }>;