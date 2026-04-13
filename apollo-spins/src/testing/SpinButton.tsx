// // import {Container, Graphics, Text} from "@pixi/react";
// // import {useCallback} from "react";
// // import type {Graphics as PixiGraphics} from "pixi.js";

// interface SpinButtonProps {
//     x:number;
//     y:number;
//     onSpin: () => void;
//     disabled: boolean;
// }

// const BUTTON_WIDTH      = 160;
// const BUTTON_HEIGHT     = 60;
// const BUTTON_RADIUS     = 12;

// export default function SpinButton({
//     x,
//     y,
//     onSpin,
//     disabled,
// }: SpinButtonProps) {
//     const drawButton = useCallback(
//         (g: PixiGraphics) => {
//             g.clear();
//             g.beginFill(disabled ? 0x555555:0xe94560);
//             g.drawRoundedRect(
//                 -BUTTON_WIDTH / 2,
//                 -BUTTON_HEIGHT / 2,
//                 BUTTON_WIDTH,
//                 BUTTON_HEIGHT,
//                 BUTTON_RADIUS,
//             );
//             g.endFill();
//         },
//         [disabled]
//     );

//     return (
//         <Container
//             x = {x}
//             y = {y}
//             interactive={!disabled}
//             cursor = {disabled ? "not-allowed" : "pointer"}
//             onclick = {disabled ? undefined: onSpin}
//         >
//             <Graphics draw = {drawButton} />
//             <Text
//                 text = {disabled && !onSpin? "OUT OF FUNDS" : "SPIN"}
//                 anchor = {0.5}
//                 x = {0}
//                 y = {0}
//                 style = {{
//                     frontSize: 22,
//                     fontWeight: "bold",
//                     fill: disabled ? 0xaaaaaa : 0xffffff
//                 }}
//             />
//         </Container>
//     )
// }