import { formatPrice, formatVariation } from "@/utils/formatters"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

type VariationBadgeProps = {
    variationType?: "Percent" | "Absolute"
    variation: number
    background?: boolean
    iconSize?: number
    aditionalText?: string
}

export function VariationBadge({variationType = "Percent", variation, background= true, iconSize=16, aditionalText}: VariationBadgeProps){


    const isVariationPositive = variation > 0

    const isPercent = variationType === "Percent"

    const icon = isVariationPositive ? <ArrowUpIcon size={iconSize}/> : <ArrowDownIcon size={iconSize}/>

    const symbol = isVariationPositive ? "+" : "-"

    const decorator = isPercent ? icon : symbol

    const cleanVariation = isPercent ? formatVariation(variation) : formatPrice(variation)

    return(
        <>
         {isVariationPositive ? (
          <span className={`flex items-center ${background && 'bg-green-100'} text-green-600 rounded-sm py-0.5 px-2 text-xs gap-1 font-semibold`}>
            {decorator} <p>{cleanVariation}{isPercent && "%"} {aditionalText && aditionalText}</p>
          </span>
        ) : (
          <span className={`flex items-center${background && 'bg-red-100'} text-red-600 rounded-sm py-0.5 px-2 text-xs gap-1 font-semibold`}>
            {decorator} <p>{cleanVariation}{isPercent && "%"} {aditionalText && aditionalText}</p>
          </span>
        )}
        </>
    )
}