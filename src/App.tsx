import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {LogIn, Users, GamepadIcon, X, Search} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMainStore } from '@/stores/main'
import {useSteamUser} from "@/hooks/useSteamUser.ts";
import {useSteamFriends} from "@/hooks/useSteamFriends.ts";
import { Input } from "@/components/ui/input"


const mockGames = [
  { id: 1, title: "Counter-Strike 2", image: "/placeholder.svg?height=200&width=460", players: [1, 2, 4, 6, 8] },
  { id: 2, title: "Dota 2", image: "/placeholder.svg?height=200&width=460", players: [1, 3, 5, 7] },
  { id: 3, title: "Team Fortress 2", image: "/placeholder.svg?height=200&width=460", players: [2, 4, 6, 8] },
  { id: 4, title: "Portal 2", image: "/placeholder.svg?height=200&width=460", players: [1, 2, 3, 4, 5, 6, 7, 8] },
  { id: 5, title: "Left 4 Dead 2", image: "/placeholder.svg?height=200&width=460", players: [1, 2, 4, 6] },
  { id: 6, title: "Half-Life 2", image: "/placeholder.svg?height=200&width=460", players: [3, 5, 7] },
  { id: 7, title: "Garry's Mod", image: "/placeholder.svg?height=200&width=460", players: [1, 2, 3, 4] },
  { id: 8, title: "Rust", image: "/placeholder.svg?height=200&width=460", players: [1, 4, 8] },
]

export default function App() {
  const { token, isLoggedIn, gamesOwned, clearAuth, userInfo, friends } = useMainStore();

  useSteamUser(token);
  const { refetch: refetchFriends, isLoading: friendsLoading } = useSteamFriends(token);

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = friends.filter((friend) => friend.steam_username.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/steam`;
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const getCommonGames = () => {
    if (selectedFriends.length === 0) return []

    return mockGames.filter((game) => selectedFriends.every((friendId) => game.players.includes(Number(friendId))))
  }

  const commonGames = getCommonGames()

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">Let's Play Together</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find out which games you and your friends can play together
            </p>
          </div>
          <Button
            size="lg"
            className="w-full bg-gray-200 hover:bg-gray-300 text-black dark:bg-[#1b2838] dark:hover:bg-[#2a475e] dark:text-white"
            onClick={handleLogin}
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login with Steam
          </Button>
        </div>
      </div>
    )
  }

  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <header className="border-b border-gray-300 dark:border-gray-800 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Let's Play Together</h1>
            <div className="flex items-center gap-4">
              <Button onClick={() => refetchFriends()}>Refetch Friends</Button>
              <Button onClick={clearAuth} variant="secondary">
                Clear Auth
              </Button>
              <ThemeToggle />
              <Avatar>
                <AvatarImage src={userInfo?.avatarUrl} alt="Your profile" />
                <AvatarFallback>{userInfo?.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span>{userInfo?.username}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="friends" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Friends ({selectedFriends.length})
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-2">
                <GamepadIcon className="h-4 w-4" />
                Common Games ({commonGames.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="friends" className="space-y-4">
              <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Your Friends</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Select the friends you want to play with to see your common games.
                  </p>

                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search friends..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-9 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear search</span>
                      </button>
                    )}
                  </div>

                  <ScrollArea className="h-[400px] pr-4">
                    {filteredFriends.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p>No friends found matching "{searchQuery}"</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredFriends.map((friend) => (
                          <div key={friend.steam_id} className="flex items-center space-x-4">
                            <label
                              htmlFor={`friend-${friend.steam_id}`}
                              className={`flex items-center space-x-4 flex-1 cursor-pointer p-2 rounded-md hover:bg-gray-700 transition-colors ${
                                selectedFriends.includes(friend.steam_id) ? "bg-gray-700" : ""
                              }`}
                            >
                              <Checkbox
                                id={`friend-${friend.steam_id}`}
                                checked={selectedFriends.includes(friend.steam_id)}
                                onCheckedChange={() => toggleFriendSelection(friend.steam_id)}
                              />
                              <div className="flex items-center space-x-4 flex-1">
                                <Avatar>
                                  <AvatarImage src={friend.steam_avatar || "/placeholder.svg"} alt={friend.steam_username} />
                                  <AvatarFallback>{friend.steam_username.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{friend.steam_username}</p>
                                </div>
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>

              {selectedFriends.length > 0 && (
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("games")}>
                    View Common Games ({commonGames.length})
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="games" className="space-y-4">
              <Card className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {selectedFriends.length > 0
                      ? `Games you can play with ${selectedFriends.length} selected friend${
                        selectedFriends.length > 1 ? "s" : ""
                      }`
                      : "Select friends to see common games"}
                  </h2>

                  {selectedFriends.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <GamepadIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Select friends to see what games you can play together</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab("friends")}
                      >
                        Select Friends
                      </Button>
                    </div>
                  ) : commonGames.length === 0 ? (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                      <GamepadIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No common games found with selected friends</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab("friends")}
                      >
                        Select Different Friends
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {commonGames.map((game) => (
                        <Card
                          key={game.id}
                          className="overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
                        >
                          <div className="aspect-video relative">
                            <img
                              src={game.image || "/placeholder.svg"}
                              alt={game.title}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold">{game.title}</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {game.players.length} friends own this game
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>

        <footer className="border-t border-gray-300 dark:border-gray-800 p-4 mt-8">
          <div className="container mx-auto text-center text-gray-600 dark:text-gray-500 text-sm">
            <p>This is a demo application. Not affiliated with Valve or Steam.</p>
          </div>
        </footer>
      </div>
  )
}
