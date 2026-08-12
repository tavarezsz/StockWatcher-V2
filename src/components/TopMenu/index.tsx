'use client'

import { usePathname } from "next/navigation"
import { menuItems } from "@/utils/constants"
import { ChevronRightIcon, LayoutDashboardIcon, ChartPieIcon, BellIcon, CogIcon, CircleQuestionMarkIcon, PlusIcon } from "lucide-react"


const routeLabels: Record<string, string> = {
  '/': 'Visão de carteira e alertas',
  '/wallet': 'Gestão de ativos e performance',
  '/alerts': 'Histórico e configuração',
  '/settings': 'Configurações',
  '/help': 'Ajuda',
}


const routeIcons: Record<string, React.ReactNode> = {
  '/': <LayoutDashboardIcon size={16} color="#009472"/>,
  '/wallet': <ChartPieIcon size={16} color="#009472"/>,
  '/alerts': <BellIcon size={16} color="#009472"/>,
  '/settings': <CogIcon size={16} color="#009472" />,
  '/help': <CircleQuestionMarkIcon size={16} color="#009472" />
}

export function TopMenu(){
    const pathname = usePathname()

    const currentItem = menuItems.find((item) => item.href === pathname);
    const currentLabel = routeLabels[pathname]
    const currentIcon = routeIcons[pathname]

    const isStockPage = pathname.startsWith("/stock/")

    return(
        <div className="flex h-[78px] border-b border-border w-full items-center justify-between px-8 py-6">
            <div className="flex items-center gap-2 ">
               {currentIcon && currentIcon} <p className="text-sm font-semibold text-primary"> {currentItem?.label ?? "Página não encontrada"} </p>  { currentLabel && <span className="flex items-center text-gray-500 text-sm gap-2"> <ChevronRightIcon size={14}/> <p>{currentLabel}</p></span>}
            </div>
            <div className="flex gap-3">
                <button className="flex items-center py-2 px-3 bg-green-600 rounded-lg text-white gap-2 cursor-pointer">
                    <PlusIcon size={16}/> <p className="text-sm">Adicionar Ativo</p>
                </button>
            </div>
        </div>
    )
}