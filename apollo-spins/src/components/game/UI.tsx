import {Container, Text} from "@pixi/react";
import type {WinResult} from "../../game/logic";
import { TextStyle } from "@pixi/text";

interface UIProps { //-b- new name
    x:number;
    y:number;
    balance: number;
    lastWin: WinResult | null;
}

export default function UI ({x, y, balance, lastWin}: UIProps){

    const isWin = lastWin && lastWin.multiplier > 0;

    return (
        <Container x={x} y={y}>
            <Text 
                text = {`Balance: €${balance}`}
                anchor = {0.5}
                x = {0}
                y = {0}
                style = {
                    new TextStyle({
                        fontSize:28,
                        fontWeight: "bold",
                        fill: 0xffffff, // -b- 0x fffffff
                    })
                }
            />

            <Text
                text={`Bet: €1 per spin`}
                anchor={0.5}
                x={0}
                y={40}
                style = {
                    new TextStyle({
                        fontSize: 16,
                        fill: 0xaaaaaa,
                    })
                }
            />

             {lastWin && (
                <Text
                text={lastWin.message}
                anchor={0.5}
                x={0}
                y={80}
                style = {
                    new TextStyle({
                        fontSize: 20,
                        fontWeight: "bold",
                        fill: isWin ? 0xffd700 : 0xff6b6b,
                    })
                }
                />
            )}
        </Container>
    )
}