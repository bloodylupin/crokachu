import Hero from "./Home/Hero";
import Intro from "./Home/Intro";
import Cards from "./Home/Cards";
import Sneak from "./Home/Sneak";
import Roadmap from "./Home/Roadmap";
import Showcase from "./Home/Showcase";
import Team from "./Home/Team";
import AnimationContainer from "./Home/AnimationContainer";

export default function Home() {
  return (
    <AnimationContainer>
      <Hero />
      <Intro />
      <Cards />
      <Sneak />
      <Roadmap />
      <Showcase />
      <Team />
    </AnimationContainer>
  )
}
