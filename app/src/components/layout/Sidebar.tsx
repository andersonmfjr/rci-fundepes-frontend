import React from "react";
import { NavLink } from "react-router-dom";
import { File, Plus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const menuItems = [
    {
      title: "Validações",
      href: "/validations",
      icon: File,
    },
    // {
    //  title: "BI",
    //  href: "/bi",
    //  icon: BarChart3,
    //},
    // FIXME: New contract menu item
    /* {
      title: 'Novo Contrato',
      href: '/contracts/new',
      icon: Plus
    } */
  ];

  return (
    <aside className="w-full lg:w-64 bg-white border-b lg:border-r lg:border-b-0 shadow-sm lg:min-h-[calc(100vh-4rem)]">
      <nav className="p-4">
        <ul className="flex lg:flex-col gap-2 lg:space-y-2 lg:space-x-0 overflow-x-auto lg:overflow-x-visible">
          {menuItems.map((item) => (
            <li key={item.href} className="flex-shrink-0 lg:flex-shrink">
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-100"
                  )
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="hidden sm:inline lg:inline">{item.title}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
