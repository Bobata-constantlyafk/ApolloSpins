export type SymbolId = "sym1" | "sym2" | "sym3" | "sym4" | "sym5";

export interface SlotSymbol{
    id: SymbolId;
    name: string;
    asset:string;
}

export const SYMBOLS: SlotSymbol[] =[
    { id: "sym1", name: "Symbol 1", asset: "/assets/nSYM01.png" },
    { id: "sym2", name: "Symbol 2", asset: "/assets/nSYM02.png" },
    { id: "sym3", name: "Symbol 3", asset: "/assets/nSYM03.png" },
    { id: "sym4", name: "Symbol 4", asset: "/assets/nSYM04.png" },
    { id: "sym5", name: "Symbol 5", asset: "/assets/nSYM05.png" },
]
export const SYMBOL_MAP: Record<SymbolId, SlotSymbol> = Object.fromEntries(
    SYMBOLS.map((s)=> [s.id, s])
) as Record<SymbolId, SlotSymbol>;