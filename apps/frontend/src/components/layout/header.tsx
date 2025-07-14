'use client';

import { UserButton } from '@clerk/nextjs';
import { 
  Menu, 
  Bell, 
  Search, 
  Settings, 
  HelpCircle, 
  Command,
  Sun,
  Moon,
  Monitor,
  ChevronDown,
  Zap,
  Globe,
  MessageSquare,
  Activity,
  Filter,
  SortDesc,
  Plus,
  Bookmark,
  History,
  Star,
  TrendingUp,
  Clock,
  Calendar,
  Users,
  FileText,
  Mail,
  Phone,
  Video,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Smartphone,
  Laptop,
  Shield,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Upload,
  Share2,
  MoreHorizontal,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLayoutStore } from '@/lib/store/layout-store';
import { useAuth } from '@/components/clerk-wrapper';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

export function Header() {
  const { toggleSidebar } = useLayoutStore();
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'info', title: 'New employee added', message: 'John Doe has been added to the system', time: '2 min ago', read: false },
    { id: 2, type: 'warning', title: 'Payroll reminder', message: 'Monthly payroll processing due tomorrow', time: '1 hour ago', read: false },
    { id: 3, type: 'success', title: 'Report generated', message: 'Q3 financial report is ready for review', time: '3 hours ago', read: true },
    { id: 4, type: 'urgent', title: 'System maintenance', message: 'Scheduled maintenance tonight at 11 PM', time: '5 hours ago', read: false },
  ]);
  const [isOnline, setIsOnline] = useState(true);
  const [quickActions, setQuickActions] = useState([
    { id: 1, label: 'Add Employee', icon: Users, shortcut: 'Ctrl+N' },
    { id: 2, label: 'Generate Report', icon: FileText, shortcut: 'Ctrl+R' },
    { id: 3, label: 'Process Payroll', icon: TrendingUp, shortcut: 'Ctrl+P' },
    { id: 4, label: 'Schedule Meeting', icon: Calendar, shortcut: 'Ctrl+M' },
  ]);

  // Add scroll effect for enhanced sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Global search shortcut
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const currentDate = new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return '⚠️';
      case 'success': return '✅';
      case 'urgent': return '🚨';
      default: return 'ℹ️';
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <TooltipProvider>
      <header
        className={`
          sticky top-0 z-50 w-full border-b transition-all duration-300 ease-in-out
          ${isScrolled
            ? 'bg-background/80 backdrop-blur-xl shadow-lg border-border/60 supports-[backdrop-filter]:bg-background/60'
            : 'bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 border-border/40'
          }
        `}
      >
        <div className="flex h-16 items-center px-4 lg:px-6 gap-4">
          {/* Mobile menu button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-accent/60 h-9 w-9 p-0 rounded-xl transition-all duration-200 hover:scale-105"
                onClick={toggleSidebar}
              >
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle Navigation</TooltipContent>
          </Tooltip>

          {/* Enhanced Global Search */}
          <div className="flex-1 flex justify-center px-2 max-w-2xl mx-auto">
            <div className="w-full max-w-lg relative">
              <div className={`relative transition-all duration-300 ${searchFocused ? 'transform scale-105' : ''}`}>
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors" />
                <Input
                  id="global-search"
                  type="search"
                  placeholder="Search anything... (⌘K)"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className={`pl-10 pr-12 h-9 w-full rounded-xl border-border/50 transition-all duration-300
                    ${searchFocused 
                      ? 'bg-background/90 border-primary/50 shadow-lg ring-2 ring-primary/20' 
                      : 'bg-background/60 hover:bg-background/80 hover:border-border/80'
                    }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {searchValue && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 hover:bg-accent/50"
                      onClick={() => setSearchValue('')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                  </kbd>
                </div>
              </div>

              {/* Search suggestions dropdown */}
              {searchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover/95 backdrop-blur-xl border border-border/50 rounded-xl shadow-xl z-50 p-2">
                  <div className="text-xs text-muted-foreground px-2 py-1 mb-2">Quick Actions</div>
                  {quickActions.map((action) => (
                    <div key={action.id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                      <action.icon className="h-4 w-4 text-primary" />
                      <span className="text-sm">{action.label}</span>
                      <kbd className="ml-auto text-xs text-muted-foreground">{action.shortcut}</kbd>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1">
            {/* Status indicators */}
            <div className="hidden md:flex items-center space-x-3 mr-4 px-3 py-1.5 rounded-xl bg-accent/30 border border-border/30">
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <span className="text-xs font-medium text-muted-foreground">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-xs font-medium text-muted-foreground">
                {currentTime}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentDate}
              </div>
            </div>

            {/* Quick actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-accent/60 transition-all duration-200 hover:scale-105">
                      <Zap className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Quick Actions</TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Quick Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {quickActions.map((action) => (
                  <DropdownMenuItem key={action.id} className="rounded-lg">
                    <action.icon className="h-4 w-4 mr-2" />
                    {action.label}
                    <kbd className="ml-auto text-xs text-muted-foreground">{action.shortcut}</kbd>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-accent/60 transition-all duration-200 hover:scale-105">
                      {theme === 'light' ? <Sun className="h-4 w-4" /> : theme === 'dark' ? <Moon className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Change Theme</TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light" className="rounded-lg">
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="rounded-lg">
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system" className="rounded-lg">
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Help Center */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-accent/60 transition-all duration-200 hover:scale-105">
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Help & Support</TooltipContent>
            </Tooltip>

            {/* Enhanced Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 relative p-0 rounded-xl hover:bg-accent/60 transition-all duration-200 hover:scale-105">
                      <Bell className="h-4 w-4" />
                      {unreadNotifications > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 border-0 shadow-lg animate-pulse">
                          {unreadNotifications}
                        </Badge>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Notifications ({unreadNotifications} new)</TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 rounded-xl border-border/50 p-0">
                <div className="flex items-center justify-between p-4 border-b border-border/30">
                  <h3 className="font-semibold">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadNotifications > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs h-7 px-2 rounded-lg"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-border/20 hover:bg-accent/30 transition-colors ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-lg">{getNotificationIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-primary rounded-full flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-border/30">
                  <Button variant="ghost" className="w-full text-sm rounded-lg">
                    View all notifications
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-accent/60 transition-all duration-200 hover:scale-105">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Settings</TooltipContent>
                </Tooltip>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl border-border/50">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg">
                  <Shield className="h-4 w-4 mr-2" />
                  Privacy & Security
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">
                  <Bell className="h-4 w-4 mr-2" />
                  Notification Preferences
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">
                  <Globe className="h-4 w-4 mr-2" />
                  Language & Region
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg">
                  <Activity className="h-4 w-4 mr-2" />
                  Activity Log
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enhanced User menu */}
            <div className="flex items-center space-x-3 ml-2 pl-2 border-l border-border/30">
              <div className="hidden md:block text-right">
                <div className="flex items-center gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                      <div className="h-1.5 w-1.5 bg-green-500 rounded-full" />
                      {user?.role?.replace('_', ' ') || 'User'}
                    </p>
                  </div>
                </div>
              </div>
              <UserButton
                afterSignOutUrl="/sign-in"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9 ring-2 ring-border/50 hover:ring-primary/30 transition-all duration-200 hover:scale-105 shadow-lg',
                    userButtonPopoverCard: 'shadow-xl border-border/50 rounded-xl backdrop-blur-xl bg-popover/95',
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Optional: Progress bar for loading states */}
        <div className="absolute bottom-0 left-0 right-0 h-px">
          <div className="h-full bg-gradient-to-r from-primary via-primary/50 to-primary opacity-0 transition-opacity duration-300" />
        </div>
      </header>
    </TooltipProvider>
  );
}