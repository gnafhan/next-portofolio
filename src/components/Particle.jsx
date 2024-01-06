import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { useTheme } from "next-themes";
import { useToggle } from "@/util/ToggleContext";
// import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.
const ParticleBG = () => {
  const [init, setInit] = useState(false);
  const [bg, setBg] = useState(false);
  const {isToggled } = useToggle();
  const options = useMemo(
    () => (
        {
            detectRetina: false,
            fpsLimit: 120,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble"
                },
                resize: false
              },
              modes: {
                bubble: {
                  distance: 80,
                  duration: 2,
                  opacity: 1,
                  size: 6
                }
              }
            },
            particles: {
              color: {
                value: "#98D0FF"
              },
              links: {
                blink: false,
                color: "#fff",
                consent: false,
                distance: 40,
                enable: true,
                opacity: 0.3,
                width: 0.5
              },
              move: {
                attract: {
                  enable: false,
                  rotate: {
                    x: 600,
                    y: 1200
                  }
                },
                bounce: false,
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 1,
                straight: false
              },
              number: {
                density: {
                  enable: false,
                  area: 2000
                },
                limit: 0,
                value: 400
              },
              opacity: {
                animation: {
                  enable: false,
                  minimumValue: 0.05,
                  speed: 2,
                  sync: false
                },
                random: false,
                value: 0.5
              },
              shape: {
                type: "circle"
              },
              size: {
                animation: {
                  enable: false,
                  minimumValue: 0.1,
                  speed: 3,
                  sync: false
                },
                random: false,
                value: 0.5
              }
            },
            polygon: {
              draw: {
                enable: true,
                lineColor: "rgba(0,255,255,0.2)",
                lineWidth: 0.5
              },
              move: {
                radius: 20
              },
              position: {
                x: 30,
                y: 30
              },
              inlineArrangement: "equidistant",
              scale: 5,
              type: "inline",
              
            }
          }
    
    ),
    [],
  );

  const options2 = useMemo(
    () => (
        {
            detectRetina: false,
            fpsLimit: 120,
            interactivity: {
              detectsOn: "canvas",
              events: {
                onHover: {
                  enable: true,
                  mode: "bubble"
                },
                resize: true
              },
              modes: {
                bubble: {
                  distance: 80,
                  duration: 2,
                  opacity: 1,
                  size: 6
                }
              }
            },
            particles: {
              color: {
                value: "#557CBE"
              },
              links: {
                blink: false,
                color: "#090C10",
                consent: false,
                distance: 40,
                enable: true,
                opacity: 0.3,
                width: 0.5
              },
              move: {
                attract: {
                  enable: false,
                  rotate: {
                    x: 600,
                    y: 1200
                  }
                },
                bounce: false,
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 1,
                straight: false
              },
              number: {
                density: {
                  enable: false,
                  area: 2000
                },
                limit: 0,
                value: 400
              },
              opacity: {
                animation: {
                  enable: false,
                  minimumValue: 0.05,
                  speed: 2,
                  sync: false
                },
                random: false,
                value: 0.5
              },
              shape: {
                type: "circle"
              },
              size: {
                animation: {
                  enable: false,
                  minimumValue: 0.1,
                  speed: 3,
                  sync: false
                },
                random: false,
                value: 0.5
              }
            },
            polygon: {
              draw: {
                enable: true,
                lineColor: "rgba(0,255,255,0.2)",
                lineWidth: 0.5
              },
              move: {
                radius: 20
              },
              position: {
                x: 30,
                y: 30
              },
              inlineArrangement: "equidistant",
              scale: 5,
              type: "inline",
              
            }
          }
    
    ),
    [],
  );

  const [opt, setOpt] = useState(options);
  const { theme, setTheme } = useTheme()


    useEffect(() => {
        if (theme === "dark") {
            setOpt(options)
        } else {
            setOpt(options2)
        }
    }, [theme]);
  // this should be run only once per application lifetime
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadAll(engine);
      //await loadFull(engine);
      await loadFull(engine);
      //await loadBasic(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    // console.log(container);
  };


  if (init && isToggled) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={opt}
      />
    );
  }

  return <></>;
};

export default ParticleBG;