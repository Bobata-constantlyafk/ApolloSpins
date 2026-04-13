// import { Stage, Container, Graphics } from "@pixi/react";
import { Stage, Container} from "@pixi/react";
import PixiCanvas from "./components/PixiCanvas";

export default function App() {
  return (
    <Stage width={800} height={600} options={{ backgroundColor: 0x1a1a2e }}>
      <Container>
        {/* Your PixiJS scene goes here */}
        <PixiCanvas />
      </Container>
    </Stage>
  );
}