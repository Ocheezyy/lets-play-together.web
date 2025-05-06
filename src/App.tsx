import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {LogIn, Users, GamepadIcon, X, Search, User, Clock} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useMainStore } from '@/stores/main'
import {useSteamUser} from "@/hooks/useSteamUser.ts";
import {useSteamFriends} from "@/hooks/useSteamFriends.ts";
import { Input } from "@/components/ui/input"
import {useGetFriendsGames} from "@/hooks/useGetFriendsGames.ts";
import {useGetOwnedGames} from "@/hooks/useGetOwnedGames.ts";

export default function App() {
  const { token, isLoggedIn, clearAuth, userInfo, friends, commonGames, gamesOwned } = useMainStore();
  const { mutate: mutateGetFriendsGames } = useGetFriendsGames();

  useSteamUser(token);
  useGetOwnedGames(token);
  const { refetch: refetchFriends } = useSteamFriends(token);

  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [gameView, setGameView] = useState<"grid" | "list">("grid");

  const filteredFriends = friends.filter((friend) => friend.steam_username.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/steam`;
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]))
  }

  const getFriendsGames = () => {
    mutateGetFriendsGames({ token: token, steam_ids: selectedFriends });
  }

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
                  <Button onClick={() => {
                    getFriendsGames();
                    setActiveTab("games");
                  }}>
                    View Common Games ({commonGames.length})
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="games" className="space-y-4">
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                      {selectedFriends.length > 0
                        ? `Games you can play with ${selectedFriends.length} selected friend${selectedFriends.length > 1 ? "s" : ""}`
                        : "Select friends to see common games"}
                    </h2>
                    <div className="flex gap-2">
                      <Button
                        variant={gameView === "grid" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGameView("grid")}
                        className="px-3"
                      >
                        Grid
                      </Button>
                      <Button
                        variant={gameView === "list" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setGameView("list")}
                        className="px-3"
                      >
                        List
                      </Button>
                    </div>
                  </div>

                  {selectedFriends.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <GamepadIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>Select friends to see what games you can play together</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab("friends")}>
                        Select Friends
                      </Button>
                    </div>
                  ) : commonGames.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <GamepadIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No common games found with selected friends</p>
                      <Button variant="outline" className="mt-4" onClick={() => setActiveTab("friends")}>
                        Select Different Friends
                      </Button>
                    </div>
                  ) : gameView === "grid" ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {commonGames.map((game) => (
                        <div
                          key={game.appid}
                          className="flex flex-col items-center text-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <img
                            src={game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : "/placeholder.svg"}
                            alt={game.name}
                            className="w-16 h-16 rounded-md mb-2"
                          />
                          <h3 className="font-medium text-sm">{game.name}</h3>
                          <p className="text-xs text-gray-400 mt-1">{selectedFriends.length} friends</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {commonGames.map((game) => (
                        <div
                          key={game.appid}
                          className="flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                        >
                          <img
                            src={game.img_icon_url ? `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : "/placeholder.svg"}
                            alt={game.name}
                            className="w-12 h-12 rounded-md mr-3"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{game.name}</h3>
                            <div className="flex items-center text-xs text-gray-400 mt-1">
                              <User className="h-3 w-3 mr-1" />
                              <span className="mr-3">{selectedFriends.length} friends</span>
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{(gamesOwned[game.appid]?.playtime_forever / 60).toFixed(0)} Hours</span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">You have {(gamesOwned[game.appid]?.playtime_2weeks / 60).toFixed(0)} Hours in the last 2 weeks</div>
                        </div>
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
