export type SymbolId = "sym1" | "sym2" | "sym3" | "sym4" | "sym5";

export interface SlotSymbol{
    id: SymbolId;
    name: string;
    asset:string;
}

export const SYMBOLS: SlotSymbol[] =[
    { id: "sym1", name: "Symbol 1", asset: "/assets/SYM01.png" },
    { id: "sym2", name: "Symbol 2", asset: "/assets/SYM02.png" },
    { id: "sym3", name: "Symbol 3", asset: "/assets/SYM03.png" },
    { id: "sym4", name: "Symbol 4", asset: "/assets/SYM04.png" },
    { id: "sym5", name: "Symbol 5", asset: "/assets/SYM05.png" },
]
//-b- Object.fromEntries
export const SYMBOL_MAP: Record<SymbolId, SlotSymbol> = Object.fromEntries(
    SYMBOLS.map((s)=> [s.id, s])
) as Record<SymbolId, SlotSymbol>;