import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TrophyIcon, HelpCircle, BarChart3 } from "lucide-react"
import { WeaponDetail } from "./types"
import InventoryModal from './inventory-modal'

interface InventoryRatingProps {
    totalPoints: number
    maxPossiblePoints: number
    weeklyChange: number
    weapons: WeaponDetail[]
    weaponTypes: string[]
}

const rankThresholds = [
    { threshold: 90, rank: 'Diamond I', color: 'text-blue-400', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/db3d7gs-b73cb461-35dc-49ea-8e8e-0a8c416b7bdb.jpg/v1/fill/w_1192,h_670,q_70,strp/league_of_legends_diamond_badge___hand_made_by_blackmaskedfox_db3d7gs-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYjNkN2dzLWI3M2NiNDYxLTM1ZGMtNDllYS04ZThlLTBhOGM0MTZiN2JkYi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.OHq9ZK8B3tQi6mYe3YgdIVp3Rlz18dwbKWbVvEm65fs" },
    { threshold: 85, rank: 'Diamond II', color: 'text-blue-400', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/db3d7gs-b73cb461-35dc-49ea-8e8e-0a8c416b7bdb.jpg/v1/fill/w_1192,h_670,q_70,strp/league_of_legends_diamond_badge___hand_made_by_blackmaskedfox_db3d7gs-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYjNkN2dzLWI3M2NiNDYxLTM1ZGMtNDllYS04ZThlLTBhOGM0MTZiN2JkYi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.OHq9ZK8B3tQi6mYe3YgdIVp3Rlz18dwbKWbVvEm65fs" },
    { threshold: 80, rank: 'Diamond III', color: 'text-blue-400', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/db3d7gs-b73cb461-35dc-49ea-8e8e-0a8c416b7bdb.jpg/v1/fill/w_1192,h_670,q_70,strp/league_of_legends_diamond_badge___hand_made_by_blackmaskedfox_db3d7gs-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzIwIiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYjNkN2dzLWI3M2NiNDYxLTM1ZGMtNDllYS04ZThlLTBhOGM0MTZiN2JkYi5qcGciLCJ3aWR0aCI6Ijw9MTI4MCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.OHq9ZK8B3tQi6mYe3YgdIVp3Rlz18dwbKWbVvEm65fs" },
    { threshold: 75, rank: 'Platinum I', color: 'text-teal-500', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/dafx18c-4606117d-7791-46d4-a2fd-2fe2cb74a017.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_platinum_badge_pin_by_blackmaskedfox_dafx18c-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYWZ4MThjLTQ2MDYxMTdkLTc3OTEtNDZkNC1hMmZkLTJmZTJjYjc0YTAxNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.MI1Y29vYliw6s6gqJrpANieUig_OBIxHCMy-p33Wo6M" },
    { threshold: 70, rank: 'Platinum II', color: 'text-teal-500', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/dafx18c-4606117d-7791-46d4-a2fd-2fe2cb74a017.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_platinum_badge_pin_by_blackmaskedfox_dafx18c-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYWZ4MThjLTQ2MDYxMTdkLTc3OTEtNDZkNC1hMmZkLTJmZTJjYjc0YTAxNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.MI1Y29vYliw6s6gqJrpANieUig_OBIxHCMy-p33Wo6M" },
    { threshold: 65, rank: 'Platinum III', color: 'text-teal-500', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/dafx18c-4606117d-7791-46d4-a2fd-2fe2cb74a017.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_platinum_badge_pin_by_blackmaskedfox_dafx18c-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYWZ4MThjLTQ2MDYxMTdkLTc3OTEtNDZkNC1hMmZkLTJmZTJjYjc0YTAxNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.MI1Y29vYliw6s6gqJrpANieUig_OBIxHCMy-p33Wo6M" },
    { threshold: 60, rank: 'Gold I', color: 'text-yellow-500', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da1z6uc-95483c9e-0565-49d9-b02c-590e9a4332e3.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_gold_badge_pin_by_blackmaskedfox_da1z6uc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTF6NnVjLTk1NDgzYzllLTA1NjUtNDlkOS1iMDJjLTU5MGU5YTQzMzJlMy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.5MyOqAZGMM-OADHu6W82Dq-F1WijwtLde2r_ZGCKOJM" },
    { threshold: 55, rank: 'Gold II', color: 'text-yellow-500', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da1z6uc-95483c9e-0565-49d9-b02c-590e9a4332e3.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_gold_badge_pin_by_blackmaskedfox_da1z6uc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTF6NnVjLTk1NDgzYzllLTA1NjUtNDlkOS1iMDJjLTU5MGU5YTQzMzJlMy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.5MyOqAZGMM-OADHu6W82Dq-F1WijwtLde2r_ZGCKOJM" },
    { threshold: 50, rank: 'Gold III', color: 'text-yellow-500', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da1z6uc-95483c9e-0565-49d9-b02c-590e9a4332e3.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_gold_badge_pin_by_blackmaskedfox_da1z6uc-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTF6NnVjLTk1NDgzYzllLTA1NjUtNDlkOS1iMDJjLTU5MGU5YTQzMzJlMy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.5MyOqAZGMM-OADHu6W82Dq-F1WijwtLde2r_ZGCKOJM" },
    { threshold: 45, rank: 'Silver I', color: 'text-gray-400', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da847yk-a98c8ea4-2f16-403a-a879-6802923ecced.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_silver_badge_pin_by_blackmaskedfox_da847yk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTg0N3lrLWE5OGM4ZWE0LTJmMTYtNDAzYS1hODc5LTY4MDI5MjNlY2NlZC5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.uwCW_MqpFKZKlUYjllugURPZxguTNnHTJafT9UZBHyE" },
    { threshold: 40, rank: 'Silver II', color: 'text-gray-400', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da847yk-a98c8ea4-2f16-403a-a879-6802923ecced.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_silver_badge_pin_by_blackmaskedfox_da847yk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTg0N3lrLWE5OGM4ZWE0LTJmMTYtNDAzYS1hODc5LTY4MDI5MjNlY2NlZC5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.uwCW_MqpFKZKlUYjllugURPZxguTNnHTJafT9UZBHyE" },
    { threshold: 35, rank: 'Silver III', color: 'text-gray-400', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da847yk-a98c8ea4-2f16-403a-a879-6802923ecced.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_silver_badge_pin_by_blackmaskedfox_da847yk-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTg0N3lrLWE5OGM4ZWE0LTJmMTYtNDAzYS1hODc5LTY4MDI5MjNlY2NlZC5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.uwCW_MqpFKZKlUYjllugURPZxguTNnHTJafT9UZBHyE" },
    { threshold: 30, rank: 'Bronze I', color: 'text-orange-600', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da846kb-1f770330-da6c-4097-bcf0-04cd5f05e25e.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_bronze_badge_pin_by_blackmaskedfox_da846kb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTg0NmtiLTFmNzcwMzMwLWRhNmMtNDA5Ny1iY2YwLTA0Y2Q1ZjA1ZTI1ZS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.P7ccGnWWLZE1MogfwQpbdqjpwIOiD4GU3wsBkKNjtjA" },
    { threshold: 25, rank: 'Bronze II', color: 'text-orange-600', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da846kb-1f770330-da6c-4097-bcf0-04cd5f05e25e.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_bronze_badge_pin_by_blackmaskedfox_da846kb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTg0NmtiLTFmNzcwMzMwLWRhNmMtNDA5Ny1iY2YwLTA0Y2Q1ZjA1ZTI1ZS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.P7ccGnWWLZE1MogfwQpbdqjpwIOiD4GU3wsBkKNjtjA" },
    { threshold: 20, rank: 'Bronze III', color: 'text-orange-600', image: "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/5ab9da31-4b60-400a-b55b-ac65b099d5cf/da846kb-1f770330-da6c-4097-bcf0-04cd5f05e25e.jpg/v1/fill/w_1024,h_576,q_75,strp/league_of_legends_bronze_badge_pin_by_blackmaskedfox_da846kb-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTc2IiwicGF0aCI6IlwvZlwvNWFiOWRhMzEtNGI2MC00MDBhLWI1NWItYWM2NWIwOTlkNWNmXC9kYTg0NmtiLTFmNzcwMzMwLWRhNmMtNDA5Ny1iY2YwLTA0Y2Q1ZjA1ZTI1ZS5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.P7ccGnWWLZE1MogfwQpbdqjpwIOiD4GU3wsBkKNjtjA" },
    { threshold: 0, rank: 'Unranked', color: 'text-gray-600', image: "https://www.bungie.net/img/destiny_content/pgcr/patrol_edz.jpg" },
]

export default function InventoryRatingCard({
    totalPoints,
    maxPossiblePoints,
    weapons,
    weaponTypes
}: InventoryRatingProps) {
    const [rank, setRank] = useState(rankThresholds[rankThresholds.length - 1])
    const [nextRank, setNextRank] = useState(rankThresholds[rankThresholds.length - 1])
    const [progressToNextRank, setProgressToNextRank] = useState(0)
    const [readinessScore, setReadinessScore] = useState(0)

    useEffect(() => {
        const calculateRank = (total: number, max: number) => {
            const score = (total / max) * 100
            let currentRank = rankThresholds[rankThresholds.length - 1]
            let nextRank = rankThresholds[rankThresholds.length - 1]
            let progress = 0

            for (let i = 0; i < rankThresholds.length; i++) {
                if (score >= rankThresholds[i].threshold) {
                    currentRank = rankThresholds[i]
                    if (i > 0) {
                        nextRank = rankThresholds[i - 1]
                        const currentThreshold = rankThresholds[i].threshold
                        const nextThreshold = rankThresholds[i - 1].threshold
                        progress = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100
                    } else {
                        nextRank = rankThresholds[i]
                        progress = 100
                    }
                    break
                }
            }

            return { rank: currentRank, nextRank, progress, score }
        }

        const result = calculateRank(totalPoints, maxPossiblePoints)
        setRank(result.rank)
        setNextRank(result.nextRank)
        setProgressToNextRank(result.progress)
        setReadinessScore(result.score)
    }, [totalPoints, maxPossiblePoints])

    return (
        <Card className="w-full overflow-hidden flex flex-col">
            <div
                className="w-full h-48 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${rank.image})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
                <CardHeader className="relative z-10">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold text-white flex items-center">
                            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
                            Inventory Rating
                        </CardTitle>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white">
                                    <HelpCircle className="h-4 w-4" />
                                    <span className="sr-only">About Inventory Rating</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>About Inventory Rating</DialogTitle>
                                </DialogHeader>
                                <p>
                                    The Inventory Rating shows your progress in collecting weapons. It takes into account the
                                    total points you've earned, your rank, and weekly changes. The higher your rating, the more
                                    complete your weapon collection is.
                                </p>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
            </div>
            <CardContent className="pt-6 flex-grow flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <h3 className={`text-3xl font-bold ${rank.color}`}>{rank.rank}</h3>
                        {/*<Badge variant={weeklyChange >= 0 ? "default" : "destructive"}>
                            {weeklyChange >= 0 ? <ArrowUpIcon className="w-4 h-4 mr-1 inline" /> : <ArrowDownIcon className="w-4 h-4 mr-1 inline" />}
                            {Math.abs(weeklyChange)} pts
                        </Badge>*/}
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium">Readiness Score</div>
                        <div className="text-2xl font-bold">{readinessScore.toFixed(1)}/100</div>
                    </div>
                </div>
                <div className="space-y-4 flex-grow">
                    <div>
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progress to {nextRank.rank}</span>
                            <span>{Math.round(progressToNextRank)}%</span>
                        </div>
                        <Progress value={progressToNextRank} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mt-4">
                        <span>Total Points</span>
                        <span>{totalPoints.toFixed(1)} / {maxPossiblePoints.toFixed(1)}</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <InventoryModal weapons={weapons} weaponTypes={weaponTypes}>
                    <Button className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Inventory Breakdown
                    </Button>
                </InventoryModal>
            </CardFooter>
        </Card>
    )
}