"use client";

import { Compass, Layout } from "lucide-react";
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
    {
        icon: Layout,
        label: "仪表盘",
        href: "/"
    },
    {
        icon: Compass,
        label: "知识库",
        href: "/search"
    }
]

export const SidebarRoutes = () => {
    const routes = guestRoutes;
    return (
        <div className="flex flex-col w-full">
            {
                routes.map((route) => (
                    <SidebarItem 
                        key={route.href} 
                        icon={route.icon} 
                        label={route.label} 
                        href={route.href} 
                    />
                ))
            }
        </div>
    );
}