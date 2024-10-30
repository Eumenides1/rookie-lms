"use client";

import { BarChart, Compass, Layout, List } from "lucide-react";
import { SidebarItem } from "./sidebar-item";
import { usePathname } from "next/navigation";

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
];
const teacherRoutes = [
    {
        icon: List,
        label: "课程列表",
        href: "/teacher/courses"
    },
    {
        icon: BarChart,
        label: "数据面板",
        href: "/teacher/analytics"
    }
];

export const SidebarRoutes = () => {
    const pathname = usePathname();
    const isTeacherPage = pathname?.includes("/teacher");
    const routes = isTeacherPage ? teacherRoutes : guestRoutes;
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