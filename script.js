const sliderContent = [
    "LuminaPad",
    "PulseEar",
    "ZenithWatch",
    "AeroCharge",
    "NimbusCam",
    "EclipseDrive",
    "TerraHub",
    "QuantumKey",
    "MeshRouter",
    "AuraBearm",
]

let currentImageIndex = 2;
let currentContentIndex = 1;
let previousImageIndex = 2;

const totalImages = 10;
let isAnimating = false;

function splitTextIntoSpans(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
        const text = element.innerText;
        const splitText = text
            .split("")
            .map(char => char === " " ? `<span>&nbsp;</span>` : `<span>${char}</span>`)
            .join("");
        element.innerHTML = splitText;
    });
}

function getImageUrl(imageIndex) {
    // Array of possible image extensions
    const imageExtensions = ['jpg', 'png'];

    // Iterate through extensions and return the first one that exists
    for (const ext of imageExtensions) {
        const imageUrl = `./images/${imageIndex}.${ext}`;
        // Check if the image exists or just return the first extension
        // For simplicity, assume it exists, or add your own existence check logic
        return imageUrl;
    }

    // Fallback image if none found
    return './images/placeholder.png'; // Adjust as needed
}



gsap.to(".slider-next-img", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // Clipping path to animate
    duration: 1.5, // Duration of the animation
    ease: "power3.out", // Easing function
    delay: 1, // Delay before the animation starts
});


document.addEventListener("click", function() {
    if(isAnimating) return;

    isAnimating = true;

    splitTextIntoSpans(".slider-content-active h1");
    gsap.to(".slider-active img", {
        scale: 2,
        duration: 2,
        ease: "power3.out",
    });

    gsap.to(".slider-content-active h1 span", {
        top: "-175px",
        stagger: 0.05,
        ease: "power3.out",
        duration: 0.5,
        onComplete: () => {
            gsap.to(".slider-content-active", {
                top: "-175px",      
                duration: 0.25,
                ease: "power3.out",
            });
        },
    });
    
    splitTextIntoSpans(".slider-content-next h1");
    gsap.set(".slider-content-next h1 span", {top : "200px"});

    gsap.to(".slider-content-next", {
        top:"0",
        duration: 1.125,
        ease:"power3.out",
        onComplete: () => {
            document.querySelector(".slider-content-active").remove();
            gsap.to(".slider-content-next h1 span", {
                top:0,
                stagger: 0.05,
                duration: 0.5,
                ease: "power3.out", 
            });

            const nextContent = document.querySelector(".slider-content-next");
            nextContent.classList.remove("slider-content-next");
            nextContent.classList.add("slider-content-active");
            nextContent.computedStyleMap.top = "0";

            currentContentIndex = (currentContentIndex + 1) % totalImages;
            const nextContentText = sliderContent[currentContentIndex];
            const newContentHTML = `<div class = "slider-content-next" style="top:200px;"><h1>${nextContentText}</h1></div>`;
            document
                .querySelector(".slider-content")
                .insertAdjacentHTML("beforeend", newContentHTML);
        },
    });

    currentImageIndex = (currentImageIndex % totalImages) + 1;

    const newSliderHTML = 
        `<div class="slider-next">
            <div class="slider-next-img">
                <img src="./images/${currentImageIndex}.jpg" alt="Image ${currentImageIndex}"/>
            </div>
        </div>`;

        document
        .querySelector(".slider")
        .insertAdjacentHTML("beforeend", newSliderHTML);

        gsap.to(".slider .slider-next:last-child .slider-next-img", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            duration: 1.5,
            ease: "power3.out",
            delay: 0.5,
        });

        const sliderNextImg = document.querySelector(".slider-next-img");
        gsap.to(sliderNextImg, {
            width:"100vw",
            height: "100vh",
            duration: 2,
            ease: "power3.out",
            onComplete: () => {
                const currentActiveSlider = document.querySelector(".slider-active");
                if (currentActiveSlider) {
                    currentActiveSlider.remove();
                }
            
                const nextSlider = document.querySelector(".slider-next");
                if (nextSlider) {
                    nextSlider.classList.remove("slider-next");
                    nextSlider.classList.add("slider-active");
            
                    const nextSliderImg = nextSlider.querySelector(".slider-next-img");
                    if (nextSliderImg) {
                        nextSliderImg.classList.remove("slider-next-img");
                    }
                }
            
                setTimeout(() => {
                    isAnimating = false;
                }, 500);
            }
            
        });
});


