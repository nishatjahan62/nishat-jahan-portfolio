import React from "react";
import Hero from "../components/Hero/Hero";
import AboutMe from "../Pages/Sections/AboutMe";
import Skills from "../Pages/Sections/Skills";
import Projects from "../Pages/Sections/Projects";
import Contact from "../Pages/Sections/Contact";
import Education from "../Pages/Sections/Education/Education";
import Experience from "../components/Experience/Experience";
import Services from "../Pages/Sections/services";

const Home = () => {
  return (
    <div className="">
      <div id="hero">
        <Hero></Hero>
      </div>
      <div id="about-me">
        <AboutMe></AboutMe>
      </div>
      <div id="skills">
        <Skills></Skills>
      </div>
      <div id="projects">
        <Projects></Projects>
      </div>
      <div id="education">
        <Education></Education>
      </div>
      <div id="services">
        <Services></Services>
      </div>

      <div id="contact">
        <Contact></Contact>
      </div>
    </div>
  );
};

export default Home;
