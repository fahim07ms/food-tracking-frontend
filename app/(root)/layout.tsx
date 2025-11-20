"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    User,
    Utensils,
    Target,
    LogOut,
    Menu,
    Package,
    Leaf,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { toast } from "sonner";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, logout, user, login } = useAuthStore();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Verify authentication with backend on mount
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await api.get("/user/me");
                if (response.data?.user) {
                    // Update auth store with user data from backend
                    login(response.data.user);
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                // If verification fails, logout and redirect
                logout();
                router.push("/login");
            } finally {
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    // Show loading state while verifying
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect if not authenticated after verification
    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    // Redirect to onboarding if health profile is incomplete
    // We check for core fields: birth_date, gender, height, weight
    const hasHealthProfile =
        user?.healthProfile &&
        user.healthProfile.birth_date &&
        user.healthProfile.gender &&
        user.healthProfile.height_cm &&
        user.healthProfile.current_weight_kg;

    if (isAuthenticated && !hasHealthProfile && pathname !== "/onboarding") {
        router.push("/onboarding");
        return null;
    }

    // If on onboarding page but has profile, redirect to dashboard
    if (isAuthenticated && hasHealthProfile && pathname === "/onboarding") {
        router.push("/");
        return null;
    }

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");
            logout();
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
            // Force logout on client even if server fails
            logout();
            router.push("/login");
        }
    };

    const navigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Food Logs", href: "/food-logs", icon: Utensils },
        { name: "Inventory", href: "/inventory", icon: Package },
        { name: "Resources", href: "/resources", icon: Leaf },
        { name: "Goals", href: "/goals", icon: Target },
        { name: "Profile", href: "/profile", icon: User },
    ];

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-background md:flex">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-semibold"
                    >
                        <Utensils className="h-6 w-6" />
                        <span className="">Poriman</span>
                    </Link>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                        pathname === item.href
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
                <div className="mt-auto p-4 border-t">
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">
                                {user?.fullName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="w-full justify-start gap-2"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="flex flex-col flex-1">
                <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6 md:hidden">
                    <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">
                                    Toggle navigation menu
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    href="/"
                                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                                    onClick={() => setIsMobileOpen(false)}
                                >
                                    <Utensils className="h-6 w-6" />
                                    <span className="sr-only">Poriman</span>
                                </Link>
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() =>
                                                setIsMobileOpen(false)
                                            }
                                            className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 hover:text-foreground ${
                                                pathname === item.href
                                                    ? "bg-muted text-foreground"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            <Icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                                <Button
                                    variant="ghost"
                                    className="justify-start gap-4 px-3 py-2 mt-4"
                                    onClick={() => {
                                        handleLogout();
                                        setIsMobileOpen(false);
                                    }}
                                >
                                    <LogOut className="h-5 w-5" />
                                    Logout
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <span className="font-semibold">Poriman</span>
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
