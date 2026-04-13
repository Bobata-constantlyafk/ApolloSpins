import { Sprite, useApp } from "@pixi/react";
import { Assets, Texture } from "pixi.js";
import { useEffect, useState } from "react";
import { SYMBOL_MAP, type SymbolId } from "../../game/symbols";

interface SymbolProps{
    symbolId:   SymbolId;
    x:          number;
    y:          number;
    size?:      number;
}

export default function Symbol ({symbolId, x, y, size = 100}: SymbolProps){
    const [texture, setTexture] = useState<Texture>(Texture.EMPTY);
    const app = useApp();

    useEffect(()=> {
        const symbol = SYMBOL_MAP[symbolId];

        Assets.load(symbol.asset).then((loadTexture:Texture) =>{
            setTexture(loadTexture);
        }); 
    }, [symbolId]);

    return (
        <Sprite
        texture={texture}
        x={x}
        y={y}
        width={size}
        height={size}
        anchor={0.5}
        />
    );
}